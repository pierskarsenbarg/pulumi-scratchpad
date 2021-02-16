import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

const role = new aws.iam.Role("ruleReportsFuncRole", {
    assumeRolePolicy: {
       Version: "2012-10-17",
       Statement: [{
          Action: "sts:AssumeRole",
          Principal: {
             Service: "lambda.amazonaws.com",
          },
          Effect: "Allow",
          Sid: "",
       }],
    },
 });

 const rolePolicyAttachment = new aws.iam.RolePolicyAttachment("rpa", {
      policyArn: aws.iam.ManagedPolicy.LambdaFullAccess,
      role: role
 })

const lambdaFunction = new aws.lambda.Function("lambdafunction", {
    code: new pulumi.asset.AssetArchive({
        ".": new pulumi.asset.FileArchive("./app"),
     }),
     role: role.arn,
     handler: "index.lambdaCode",
     runtime: "nodejs14.x"
});

const gateway = new awsx.apigateway.API(
    `my-lambda-gateway`,
    {
      routes: [
        {
          path: '/myLambdaFunction',
          method: 'POST',
          eventHandler: lambdaFunction
        }
      ]
    }
  );