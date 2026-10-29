FROM node:22-bookworm-slim AS build

WORKDIR /app
COPY package.json ./
COPY client/package.json ./client/package.json
COPY server/package.json ./server/package.json
RUN npm install
COPY client ./client
COPY server ./server
RUN npm run build

FROM node:22-bookworm-slim
ENV NODE_ENV=production
ENV DATABASE_PATH=/data/site.db

WORKDIR /app
COPY package.json ./
COPY client/package.json ./client/package.json
COPY server/package.json ./server/package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/client/dist ./client/dist
RUN mkdir -p /data && chown node:node /data

WORKDIR /app/server
USER node
EXPOSE 3001
CMD ["node", "dist/index.js"]
