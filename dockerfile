#Hole node als Baseimage
FROM node

WORKDIR /bot

COPY package.json ./

RUN npm install

COPY ./src .

EXPOSE 3000

CMD ["npm", "start"]