
FROM node:slim
WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm run build
EXPOSE 4001

# Command to run the application
CMD [ "npm", "run", "start" ]
