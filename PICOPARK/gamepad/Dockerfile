FROM node:22-alpine
LABEL org.opencontainers.image.source="https://github.com/leonardo7894/Pico-Park-Leonardo-O"
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV EXPO_NO_TELEMETRY=1
ENV EXPO_NO_DEPENDENCY_VALIDATION=1
EXPOSE 8081
CMD ["npx", "expo", "start", "--lan", "--port", "8081"]
