import { createServer } from "./server";
import logger from "./logger";
import "express-async-errors";

const port = process.env.PORT || 3001;
const server = createServer();

server.listen(port, () => {
  logger.info(`API running on port ${port}`);
});
