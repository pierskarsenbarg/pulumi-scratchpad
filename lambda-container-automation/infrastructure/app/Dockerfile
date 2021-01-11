FROM amazon/aws-lambda-nodejs:12

WORKDIR /var/task

COPY . .

RUN npm install

CMD ["index.handler"]