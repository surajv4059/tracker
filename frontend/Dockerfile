
FROM node:20.12.2

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

RUN chmod -R 755 /app

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]

