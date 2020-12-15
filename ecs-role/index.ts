import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as fs from 'fs';

const taskRole = new aws.iam.Role("taskRole", {
    assumeRolePolicy: {
        Version: "2012-10-17",
        Statement: [{
            Action: "sts:AssumeRole",
            Principal: {
                Service: "ecs-tasks.amazonaws.com"
            },
            Effect: "Allow",
            Sid: "",
        }]
    },
});

const bucketName = "pk-bucket-fargate-test";

const bucket = new aws.s3.Bucket("fargate-bucket", {
    bucket: bucketName
});

const rolePolicyAttachment = new aws.iam.RolePolicyAttachment("my-rpa", {
    role: taskRole,
    policyArn: aws.iam.ManagedPolicy.AmazonS3FullAccess
});

const img = awsx.ecs.Image.fromPath("image", "./app");

const fargateTask = new awsx.ecs.FargateTaskDefinition("pk-task", {
    containers: {
        container: {
            image: img
        }
    },
    taskRole: taskRole
});

const cluster = new awsx.ecs.Cluster("s3-test-cluster");


