// Package imports
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const { getHealthStatusService } = require("./api/services/healthz");
const logger = require("./api/middleware/logger");

const userRouter = require("./api/routes/user");
const healthzRouter = require("./api/routes/healthz");

// App level variables initialization
const port = process.env.PORT;
app.use(bodyParser.json());
app.use(cors({ origin: "*" }));

// Serve Swagger UI
const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "CSYE 6225 - Cloud Native Web Application",
      version: "1.0.0",
      description: "API documentation for all the cloud assignments",
    },
    servers: [
      {
        url: "http://localhost:8888",
        description: "Development server",
      },
    ],
  },
  apis: ["./api/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

app.use(
  "/api-docs/csye6225-webapp",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.use(async (req, res, next) => {
  res.set("cache-control", "no-store, no-cache, must-revalidate");
  try {
    await getHealthStatusService();
    next();
  } catch (error) {
    res.status(503).end();
  }
});

app.use(async (req, res, next) => {
  if (
    Object.keys(req.query).length != 0 ||
    Object.keys(req.params).length != 0
  ) {
    return res.status(400).json({ message: "Query or parameters not allowed" });
  } else {
    next();
  }
});

app.use("/v1/user", userRouter);
app.use("/healthz", healthzRouter);

const server = app.listen(port, () => {
  logger.info(`Server is running on port ${port}`, { severity: "INFO" });
});

module.exports = server;
