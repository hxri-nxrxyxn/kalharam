FROM node:22-bullseye-slim AS base
WORKDIR /app/backend
# better-sqlite3 and sharp require python, build tools, and related libs
RUN apt-get update && apt-get install -y python3 build-essential libvips-dev && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install --ignore-scripts=false

COPY . .

EXPOSE 3000
CMD ["node", "server.js"]
