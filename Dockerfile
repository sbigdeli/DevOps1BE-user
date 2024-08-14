# Tar en image från node:slim
FROM node:slim
# Skapar en fil & döper till /usr/src/app
WORKDIR /usr/src/app
# Kopierar allting i repot till Docker containern
COPY . .
# Kör npm install, installerar dependencies
RUN npm install
#Kör npm build, bygger projektet
RUN npm run build
# Använder port 4001
EXPOSE 4001
# Kör npm, run, prod i Docker
CMD [ "npm", "run", "prod" ]
