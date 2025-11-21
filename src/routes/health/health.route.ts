import type { FastifyInstance } from "fastify";

export const registerHealthRoutes = (app: FastifyInstance) => {
	app.get("/api/health", async () => ({
		status: "ok",
		timestamp: new Date().toISOString(),
	}));
};
