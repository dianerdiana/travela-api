import { json, urlencoded } from "body-parser";
import express, { type Express } from "express";
import morgan from "morgan";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error";
import { ApiRoutes } from "./routes/api";

export const createServer = (): Express => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())
    .get("/status", (_, res) => {
      return res.json({ ok: true });
    })
    .use("/api", ApiRoutes)
    .use(errorMiddleware);

  return app;
};
