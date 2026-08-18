FROM node:22-bookworm-slim AS base
WORKDIR /app
RUN apt-get update && apt-get install -y python3 build-essential && rm -rf /var/lib/apt/lists/*

# Install backend dependencies (rebuild native modules for this OS)
COPY backend/package.json ./backend/
RUN cd backend && npm install --ignore-scripts=false

# Copy source
COPY backend/ ./backend/

# Create the uploads directory that server.js references via ../web/static/assets/uploads
RUN mkdir -p ./web/static/assets/uploads

EXPOSE 3000
CMD ["node", "backend/server.js"]
