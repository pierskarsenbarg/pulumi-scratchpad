import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { Output, ProviderResource } from "@pulumi/pulumi";

interface S3Bucket {
    bucketName: string,
    awsProvider: ProviderResource
}

export class S3BucketInRegion extends pulumi.ComponentResource {
    bucketId: Output<string>;
    constructor(name: string, args: S3Bucket) {
        super("pkg:x:S3BucketInRegion", name, {});

        const bucket = new aws.s3.Bucket(args.bucketName,{
            acl: "private"
        }, {provider: args.awsProvider});

        this.bucketId = bucket.id;

        this.registerOutputs();
    }
}