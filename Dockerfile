FROM node:11-alpine as build

WORKDIR /src
COPY package*.json /src/

RUN npm set progress=false && npm config set depth 0 && npm install --only=production
RUN cp -R node_modules prod_node_modules
RUN npm set progress=false && npm config set depth 0 && npm install

COPY . .

RUN npm run build:prod

FROM node:11-alpine as release

COPY --from=build /src/prod_node_modules /app/node_modules
COPY --from=build /src/dist /app/dist

ENV PORT=80
ENV NODE_ENV=production
EXPOSE 80

CMD ["node", "/app/dist/server/index.js"]