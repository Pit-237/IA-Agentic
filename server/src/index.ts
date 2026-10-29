import { app } from "./app.js";
import { config } from "./config.js";
import { database } from "./database.js";

const server = app.listen(config.PORT, () => {
  console.log(`API listening on port ${config.PORT}`);
});

function shutdown(): void {
  server.close(() => {
    database.close();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
