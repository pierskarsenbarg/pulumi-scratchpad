import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

const image = awsx.ecr.buildAndPushImage("app", {
    context: "./app"
});

const role = new aws.iam.Role("lambdarole", {
    assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({ Service: "lambda.amazonaws.com" }),
});

const lambdaFullAccess =  new aws.iam.RolePolicyAttachment("lambdaFullAccess", {
    role: role.name,
    policyArn: aws.iam.ManagedPolicies.AWSLambdaFullAccess,
});

const lambdaFunction = new aws.lambda.Function("function", {
    packageType: "Image",
    imageUri: image.imageValue,
    role: role.arn
});

