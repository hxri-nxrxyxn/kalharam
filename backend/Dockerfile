FROM node:22-bookworm-slim AS base
WORKDIR /app/backend
# better-sqlite3 requires python, build tools
RUN apt-get update && apt-get install -y python3 build-essential && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN rm -f package-lock.json && npm install --ignore-scripts=false

COPY . .

EXPOSE 3000
CMD ["node", "server.js"]
