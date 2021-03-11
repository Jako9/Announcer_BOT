FROM node

WORKDIR /announcer/
COPY package.json ./
RUN npm install

CMD ["npm", "start"]