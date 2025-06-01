FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json ./

RUN npm install -g @ionic/cli && \
    npm install --force --legacy-peer-deps

COPY . .

ENV NODE_ENV=development
ENV HOST=0.0.0.0
ENV PORT=8100
ENV DISABLE_HOST_CHECK=true

EXPOSE 8100 35729

CMD ["ionic", "serve", "--external", "--disable-host-check", "--host=0.0.0.0", "--port=8100"]