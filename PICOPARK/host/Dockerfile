FROM node:22-alpine
LABEL org.opencontainers.image.source="https://github.com/leonardo7894/Pico-Park-Leonardo-O"
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
ENV PORT=3000
EXPOSE 3000
CMD ["node", "server.js"]
