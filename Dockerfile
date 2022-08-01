FROM node:16-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install
RUN yarn run prisma:generate
COPY . .
RUN yarn workspace backend build

EXPOSE 3001
CMD [ "yarn", "backend" ]