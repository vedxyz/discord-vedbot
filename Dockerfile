FROM node:16.14.0

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

CMD [ "npm", "run", "start" ]
