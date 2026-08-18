FROM node:22-bullseye-slim AS base
WORKDIR /app
# better-sqlite3 and sharp require python, build tools, and related libs
RUN apt-get update && apt-get install -y python3 build-essential libvips-dev && rm -rf /var/lib/apt/lists/*

FROM base AS builder
WORKDIR /app
COPY . .

# Build Backend
RUN cd backend && npm install --ignore-scripts=false

# Build Web (Storefront)
RUN cd web && npm ci || npm install
RUN cd web && npm run build

# Build App (Admin Console)
RUN cd app && npm ci || npm install
RUN cd app && npm run build

FROM base AS runner
WORKDIR /app

# Install 'serve' to host the static admin SPA
RUN npm install -g serve

# Copy built outputs and dependencies
COPY --from=builder /app/backend ./backend
COPY --from=builder /app/web/build ./web/build
COPY --from=builder /app/web/package.json ./web/package.json
COPY --from=builder /app/web/node_modules ./web/node_modules
COPY --from=builder /app/web/static ./web/static
COPY --from=builder /app/app/build ./app/build

# Expose ports that will be used
EXPOSE 3000 5173 5174
