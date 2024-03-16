const winston = require("winston");
const fs = require("fs");
const dir = "/var/log/webapp/";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}
const logger = winston.createLogger({
  level: "silly",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "/var/log/webapp/app.log" }),
  ],
});

module.exports = logger;
