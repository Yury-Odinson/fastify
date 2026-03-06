FROM oven/bun:1.3.6 AS deps
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM deps AS build
WORKDIR /app

COPY tsconfig.json ./
COPY src ./src
RUN bun run build

FROM oven/bun:1.3.6 AS runtime
WORKDIR /app

ENV NODE_ENV=production

COPY package.json bun.lock drizzle.config.ts ./
COPY drizzle ./drizzle
COPY src/db/seeds ./src/db/seeds
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE 4000

CMD ["bun", "run", "start"]
