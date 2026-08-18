FROM node:22-bookworm-slim AS builder
WORKDIR /app/web

COPY package*.json ./
RUN rm -f package-lock.json && npm install

COPY . .
RUN npm run build

FROM node:22-bookworm-slim AS runner
WORKDIR /app/web

COPY --from=builder /app/web/build ./build
COPY --from=builder /app/web/package.json ./package.json
COPY --from=builder /app/web/node_modules ./node_modules
COPY --from=builder /app/web/static ./static

EXPOSE 5173
CMD ["node", "build/index.js"]
