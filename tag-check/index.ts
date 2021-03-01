import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

const vpc = awsx.ec2.Vpc.getDefault();

const requiredMachines = 3;
const name = "pk-instances";

const zoneId = "";
const subnetId = "";
const amiId = "";
const securityGroupId = "";

let volumeType = "gp3";
let volumeSize = 50;

for (let i = 1; i < requiredMachines + 1; i++) {
  const instance = new aws.ec2.Instance(`${name}-${i}`, {
    ami: amiId,
    instanceType: aws.ec2.InstanceTypes.T3_Small,
    subnetId: subnetId,
    vpcSecurityGroupIds: [securityGroupId],
    ebsOptimized: true,
    monitoring: true,
    //keyName: "kubesphere",
    tags: {
      Billing: "PCIDevOps",
      Environment: "DEV",
      Name: `${name}-${i}`,
      "pulumi:Project": pulumi.getProject(),
      "pulumi:Stack": pulumi.getStack(),
    },
    rootBlockDevice: {
      encrypted: true,
      deleteOnTermination: true,
      volumeSize: 40,
    },
    ebsBlockDevices: [
      {
        deviceName: "/dev/sda1",
        deleteOnTermination: true,
        encrypted: true,
        volumeSize: volumeSize,
        volumeType: volumeType,
        tags: {
          Name: `${name}-server-${i}-/dev/sda1`,
          Environment: "DEV",
          "pulumi:Project": pulumi.getProject(),
          "pulumi:Stack": pulumi.getStack(),
        },
      },
    ],
  });

  const private_zone = aws.route53.getZone({zoneId: zoneId});

  // Creating an A Record in route53

  const instanceDNSRecord = new aws.route53.Record(
    `DNS A record for ${name}-${i}`,
    {
      zoneId: private_zone.then(x=> x.id),
      name: pulumi.interpolate`${name}-${i}.${private_zone.then(x => x.name)}`,
      type: "A",
      ttl: 300,
      records: [instance.privateIp],
    }
  );
}

export const vpcid = vpc.id;