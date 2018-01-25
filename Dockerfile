FROM node:8
ENV NODE_ENV=production
WORKDIR /usr/src

COPY package*.json ./
RUN npm install --only=production

COPY app ./app

CMD ["npm","start"]
USER node
