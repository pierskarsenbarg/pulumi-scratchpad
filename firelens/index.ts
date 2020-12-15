import * as awsx from "@pulumi/awsx";
import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

const cluster = new awsx.ecs.Cluster("cluster");

// Create a load balancer on port 80 and spin up two instances of Nginx.
const lb = new awsx.lb.ApplicationListener("nginx-lb", { port: 80 });

const fargateTask = new awsx.ecs.FargateTaskDefinition(
  `taskdefinition-firelens`,
  {
    logGroup: null,
    containers: {
      container: {
        image: "nginx",
        essential: true,
        memory: 128,
        portMappings: [lb],
        logConfiguration: {
          logDriver: "awsfirelens",
          options: {
            Name: "cloudwatch",
            region: "us-west-2",
            log_group_name: "firelens-fluent-bit",
            auto_create_group: "true",
            log_stream_prefix: "from-fluent-bit",
          },
        },
      },
      log_router: {
        image:
          "906394416424.dkr.ecr.eu-west-1.amazonaws.com/aws-for-fluent-bit:latest",
        firelensConfiguration: {
          type: "fluentbit",
        },
        logConfiguration: {
          logDriver: "awslogs",
          options: {
            "awslogs-group": "firelens-container",
            "awslogs-region": "eu-west-1",
            "awslogs-create-group": "true",
            "awslogs-stream-prefix": "firelens",
          },
        },
      },
    },
    tags: {
      Owner: "piers",
    },
  }
  // {
  //   transformations: [
  //     (args) => {
  //       if (args.type === "aws:ecs/taskDefinition:TaskDefinition") {
  //         let containerDefinitions: string = args.props.containerDefinitions.apply(
  //           (x: string) => {
  //             let definitions: aws.ecs.ContainerDefinition[] = JSON.parse(x);
  //             definitions.filter(
  //               (x: any) => x.name == "container"
  //             )[0].logConfiguration = {
  //               logDriver: "awslogs",
  //               "options": {
  //                 "awslogs-group": "taskdefinition-firelens-360c71b",
  //                 "awslogs-region": "eu-west-1",
  //                 "awslogs-create-group": "true",
  //                 "awslogs-stream-prefix": "firelens"
  //               },
  //             };
  //             return JSON.stringify(definitions);
  //           }
  //         );

  //         return {
  //           props: {
  //             ...args.props,
  //             tags: { ...args.props.tags, foo: "bar" },
  //             containerDefinitions: containerDefinitions,
  //           },
  //           opts: args.opts,
  //         };
  //       }
  //       return undefined;
  //     },
  //   ],
  // }
);

const service = new awsx.ecs.FargateService("my-service", {
  cluster: cluster,
  taskDefinition: fargateTask,
  desiredCount: 1,
});

// Export the load balancer's address so that it's easy to access.
export const url = lb.endpoint.hostname;
