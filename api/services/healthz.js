const mysql = require("mysql2");
const logger = require("../middleware/logger");

const getHealthStatusService = async () => {
  try {
    logger.info("getHealthStatusService: Checking database connection");
    await checkDatabaseConnection();
    return;
  } catch (error) {
    logger.error(
      `getHealthStatusService: Error checking database connection: ${error}`
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
