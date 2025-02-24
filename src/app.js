import cors from "cors";
import express from "express";
import globalErrorHandler from "./errorHandler/globalErrorHandler.js";
// import route from "./routes/index.js";
// import config from "./config/index.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(config.api_route, route);
app.get("/", (req, res) => {
  res.status(200).json("server is running");
});
app.use((req, res, next) => {
  res.status(400).json({
    success: false,
    message: "Not found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API not found",
      },
    ],
  });
  next();
});
app.use(globalErrorHandler);
export default app;
