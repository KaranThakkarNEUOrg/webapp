const mysql = require("mysql2");
const { getHealthStatusService } = require("../services/healthz");
const logger = require("../middleware/logger");

const getHealthzStatus = async (req, res) => {
  res.set("cache-control", "no-store, no-cache, must-revalidate");
  try {
    logger.info("getHealthzStatus: Checking health status");
    await getHealthStatusService();
    res.status(200).end();
  } catch (error) {
    logger.error(`getHealthzStatus: Error checking health status: ${error}`);
    res.status(503).end();
  }
};

module.exports = { getHealthzStatus };
