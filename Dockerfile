FROM node

WORKDIR /bot
COPY package.json ./
RUN npm install
COPY ./src .

CMD ["npm", "start"]