FROM node:18

WORKDIR /app

COPY package*.json ./
RUN apt-get update && apt-get install -y netcat-openbsd && npm install

COPY . .

COPY wait-for.sh /wait-for.sh
RUN chmod +x /wait-for.sh

CMD ["/wait-for.sh", "kafka:9092", "npm", "start"]