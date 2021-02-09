import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const cert = new aws.acm.Certificate("cert", {
    domainName: "ssl.piers.dev",
    validationMethod: "DNS"
});

const dnszone = aws.route53.getZone({
    name: "piers.dev"
}).then(zone => zone.id);

const vpc = new aws.ec2.DefaultVpc("default");

const subnetIds = aws.ec2.getSubnetIds(
    {
        vpcId: "vpc-d1c7fcb7"
    }).then(x => x.ids);

const lb = new aws.lb.LoadBalancer("lb", {
    loadBalancerType: "application",
    subnets: subnetIds
});

const sslRecord = new aws.route53.Record("ssl", {
    name: "ssl.piers.dev",
    type: "CNAME",
    zoneId: dnszone,
    ttl: 60,
    records: [lb.dnsName]
})

const validationRecord = new aws.route53.Record("validationRecord", {
    name: cert.domainValidationOptions[0].resourceRecordName,
    zoneId: dnszone,
    type: cert.domainValidationOptions[0].resourceRecordType,
    records: [cert.domainValidationOptions[0].resourceRecordValue],
    ttl: 60
});

const validation = new aws.acm.CertificateValidation("validation", {
    certificateArn: cert.arn,
    validationRecordFqdns: [validationRecord.fqdn]
});

const listener = new aws.lb.Listener("listener", {
    loadBalancerArn: lb.arn,
    certificateArn: cert.arn,
    defaultActions: [{
        type: "fixed-response",
        fixedResponse: {
            messageBody: "Fixed response content",
            statusCode: "200",
            contentType: "text/plain"
        }
    }],
    port: 443,
    protocol: "HTTPS"
});

