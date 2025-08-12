FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
COPY src ./src
COPY data ./data
RUN npm ci --no-audit --no-fund && npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY package*.json ./
COPY data ./data
RUN npm ci --omit=dev --no-audit --no-fund
CMD ["node", "dist/main.js"]
