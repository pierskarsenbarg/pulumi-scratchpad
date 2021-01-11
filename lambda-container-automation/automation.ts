import {
    LocalProgramArgs,
    LocalWorkspace,
    OutputMap
  } from "@pulumi/pulumi/x/automation";
  import * as upath from "upath";
  import * as fs from "fs";
  
  const args: LocalProgramArgs = {
    stackName: "dev",
    workDir: upath.joinSafe(__dirname, ".", "infrastructure"),
  };

  export async function deploy(): Promise<any> {

    console.log("Delete file");
    const textpath: string = upath.joinSafe(__dirname, ".", "infrastructure", "app", "file.txt");
    
    if(fs.existsSync(textpath)) {
        await fs.unlink(textpath, (err) => {
            if(err) {
                console.log("File couldn't be deleted");
            }
        });
    }

    console.log("Initialising stack...");
    const stack = await LocalWorkspace.createOrSelectStack(args);
  
    console.log("Setting region...");
    await stack.setConfig("aws:region", {value: "eu-west-1"});
  
    console.log("Run update...");
    await stack.up({ onOutput: console.log });

    console.log("Create new file");
    await fs.writeFile(textpath, "Hello world!", (err) => {
        if(err) {
            console.log(`error writing to file: ${err}`);
        }
    });

    console.log("Re-Run update...");
    await stack.up({ onOutput: console.log });
  
    return;
  }