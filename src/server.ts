import { buildApp } from "./app.js";

const start = async () => {
  const app = await buildApp();

  try {
    const address = await app.listen({
      port: app.config.PORT,
      host: app.config.HOST,
    });

    app.log.info(`Server listening on ${address}`);
  } catch (error) {
    app.log.error(error, "Failed to start server");
    process.exit(1);
  }
};

start();
