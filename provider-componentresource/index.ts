import * as aws from "@pulumi/aws";
import {S3BucketInRegion} from "./s3";

const awsProvider = new aws.Provider("eu-west-2", {region:"eu-west-2"});

const bucket = new S3BucketInRegion("bucketInLondon", {awsProvider, bucketName: "londonBucket"});

export const bucketId = bucket.bucketId;