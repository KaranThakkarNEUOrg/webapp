const mysql = require("mysql2");
const logger = require("../middleware/logger");
const sequelize = require("../config/database");

const getHealthStatusService = async () => {
  try {
    logger.info(
      "getHealthStatusService: Checking database connection - new image",
      {
        severity: "INFO",
      }
    );
    await sequelize.authenticate();
    return;
  } catch (error) {
    logger.error(
      `getHealthStatusService: Error checking database connection: ${error}`,
      { severity: "ERROR" }
    );
    throw new Error(error);
  }
};

// Database connection check
function checkDatabaseConnection() {
  const connection = mysql.createConnection({
    host: process.env.MYSQL_HOSTNAME,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASENAME,
  });

  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        reject(`Error connecting to database: ${err.message}`);
      }
      resolve(true);
    });
  });
}

module.exports = { getHealthStatusService };
