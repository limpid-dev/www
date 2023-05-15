FROM node:18-alpine AS base
WORKDIR /www

FROM base as dependencies
COPY package*.json ./
RUN npm ci
COPY . .

FROM dependencies AS build
RUN npm run build

FROM base AS production
COPY --from=build /www/.next .
CMD ["node", "server.js"]
