# Automation api demo

Example if you don't have the original pulumi code but you want to access the stack using automation api.

## To run

1. In a separate folder, run `pulumi new aws-typescript`, make a note of the project and stack names as well as the AWS region you've deployed this to
1. Run `pulumi up` to deploy the stack
1. In this folder, run `npm install`
1. Update the constants at the top of `index.ts` with the project name, stack name and AWS region
1. Run `npm start` to run. The program will write to console the name of the bucket deployed earlier
