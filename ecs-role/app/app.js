const AWS = require('aws-sdk');
const fs = require('fs');

const s3 = new AWS.S3();
fs.writeFile("./file.txt", "Hello World", (err) => {
  if (err) throw err;
  console.log("File written");
});
let file = fs.readFileSync("./file.txt");
s3.putObject({
  Bucket: "pk-bucket-fargate-test",
  Key: "file.txt",
  Body: file,
}, (err) => {
    if (err) throw err;
    console.log("File uploaded");
});
