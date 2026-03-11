local dev:

docker compose down
start: bun run docker:local:up
logs: bun run docker:local:logs
check API: curl http://localhost:4000/api/health
stop: bun run docker:local:down
