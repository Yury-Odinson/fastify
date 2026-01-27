import type { FastifyInstance } from "fastify";

export type AuthenticatedApp = FastifyInstance & {
	authenticate: (req: unknown, reply: unknown) => Promise<void>;
};
