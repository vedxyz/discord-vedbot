FROM node:16.14.0

RUN apt-get update && apt-get install -y --no-install-recommends poppler-utils

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

CMD [ "npm", "run", "start" ]
