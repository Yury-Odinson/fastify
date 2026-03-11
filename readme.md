local dev:

docker compose down
start: bun run docker:local:up
logs: bun run docker:local:logs
stop: bun run docker:local:down
