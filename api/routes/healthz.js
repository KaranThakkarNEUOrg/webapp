const express = require("express");
const router = express.Router();
const { getHealthzStatus } = require("../controllers/healthz");
const checkContentLength = require("../middleware/contentLength");
const logger = require("../middleware/logger");

/**
 * @swagger
 * tags:
 *   name: Public
 *   description: Operations available to all users without authentication
 */

/**
 * @swagger
 * /healthz:
 *   get:
 *     summary: Returns health status of the application
 *     tags: [Public]
 *     responses:
 *       200:
 *        description:
 *         server responds with 200 OK if it is healhty.
 *       503:
 *        description:
 *         server
 *         server responds with 503 if it is not healhty.
 */

/**
 * @swagger
 * /healthz:
 *   post:
 *     summary: Healthz Endpoint
 *     tags: [Public]
 *     responses:
 *       405:
 *        description:
 *         server responds with 405 Method Not Allowed.
 */

/**
 * @swagger
 * /healthz:
 *   put:
 *     summary: Healthz Endpoint
 *     tags: [Public]
 *     responses:
 *       405:
 *        description:
 *         server responds with 405 Method Not Allowed.
 */

/**
 * @swagger
 * /healthz:
 *   delete:
 *     summary: Healthz Endpoint
 *     tags: [Public]
 *     responses:
 *       405:
 *        description:
 *         server responds with 405 Method Not Allowed.
 */

/**
 * @swagger
 * /healthz:
 *   head:
 *     summary: Healthz Endpoint
 *     tags: [Public]
 *     responses:
 *       405:
 *        description:
 *         server responds with 405 Method Not Allowed.
 */

/**
 * @swagger
 * /healthz:
 *   options:
 *     summary: Healthz Endpoint
 *     tags: [Public]
 *     responses:
 *       405:
 *        description:
 *         server responds with 405 Method Not Allowed.
 */
router.all("/", checkContentLength, (req, res) => {
  if (
    Object.keys(req.body).length !== 0 ||
    Object.keys(req.params).length !== 0 ||
    Object.keys(req.query).length !== 0
  ) {
    logger.warn(`Invalid request to /healthz endpoint`, {
      severity: "WARNING",
    });
    res.status(400).end();
  } else if (req.method === "GET") {
    logger.info(`GET /healthz endpoint`, { severity: "INFO" });
    getHealthzStatus(req, res);
  } else {
    logger.warn(`Method Not Allowed for /healthz endpoint`, {
      severity: "WARNING",
    });
    res.status(405).end();
  }
});

module.exports = router;
