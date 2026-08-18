FROM node:22-bookworm-slim AS builder
WORKDIR /app/app

COPY package*.json ./
RUN rm -f package-lock.json && npm install

COPY . .
RUN npm run build

FROM node:22-bookworm-slim AS runner
WORKDIR /app/app

RUN npm install -g serve

COPY --from=builder /app/app/build ./build

EXPOSE 5174
CMD ["serve", "-s", "build", "-l", "5174"]
