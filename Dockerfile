FROM oven/bun:1.3.6 AS build
WORKDIR /app
RUN bun init
RUN bun install

EXPOSE 4000
ENV NODE_ENV=production

CMD ["bun", "dist/server.js"]
