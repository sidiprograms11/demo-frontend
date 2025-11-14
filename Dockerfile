# ---------- build Angular ----------
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx ng build --configuration production

# ---------- runtime Express ----------
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY server.js ./server.js
COPY --from=build /app/dist/frontend ./dist/frontend
EXPOSE 8080
CMD ["node", "server.js"]
