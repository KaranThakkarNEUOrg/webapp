const mysql = require("mysql2");
const { getHealthStatusService } = require("../services/healthz");
const logger = require("../middleware/logger");

const getHealthzStatus = async (req, res) => {
  res.set("cache-control", "no-store, no-cache, must-revalidate");
  try {
    await getHealthStatusService();
    logger.info("getHealthzStatus: Health check passed", { severity: "INFO" });
    res.status(200).end();
  } catch (error) {
    res.status(503).end();
  }
};

module.exports = { getHealthzStatus };
