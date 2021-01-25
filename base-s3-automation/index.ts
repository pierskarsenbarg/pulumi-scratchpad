import { InlineProgramArgs, LocalWorkspace } from "@pulumi/pulumi/x/automation";

const stackName: string = "dev";
const projectName: string = "base-s3";
const awsRegion: string = "eu-west-1";

const run = async () => {

    const pulumiProgram = async () => { };
    // Create our stack 
    const args: InlineProgramArgs = {
        stackName,
        projectName,
        program: pulumiProgram
    };

    // create (or select if one already exists) a stack that uses our inline program
    const stack = await LocalWorkspace.createOrSelectStack(args);
    await stack.workspace.installPlugin("aws", "v3.6.1");
    await stack.setConfig("aws:region", { value: awsRegion });
    await stack.refresh();

    var outputs = await stack.outputs();

    console.log(`Bucket name: ${outputs.bucketName.value}`);
};

run().catch(err => console.log(err));
