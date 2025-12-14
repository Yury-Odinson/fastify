import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";

export default fp(async (fastify) => {
	fastify.register(fastifyJwt, {
		secret: process.env.JWT_SECRET!,
		sign: { expiresIn: "15m" },
	});

	fastify.decorate("authenticate", async (req: any, reply: any) => {
		try {
			await req.jwtVerify();
		} catch {
			return reply.code(401).send({ message: "Unauthorized" });
		}
	});
});
