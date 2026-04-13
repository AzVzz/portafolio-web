FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p data/uploads

EXPOSE 4400

CMD ["node", "src/index.js"]
