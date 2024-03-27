const express = require("express");
const router = express.Router();
const {
  getUser,
  createUser,
  updateUser,
  verifyUser,
} = require("../controllers/user");
const authMiddleware = require("../middleware/auth");
const checkContentLength = require("../middleware/contentLength");
const logger = require("../middleware/logger");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - first_name
 *         - last_name
 *         - password
 *         - username
 *         - account_created
 *         - account_updated
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: d290f1ee-6c54-4b01-90e6-d701748f0851
 *           readOnly: true
 *         first_name:
 *           type: string
 *           example: Karan
 *         last_name:
 *           type: string
 *           example: Thakkar
 *         password:
 *           type: string
 *           format: password
 *           example: Myapi@123
 *           writeOnly: true
 *         username:
 *           type: string
 *           format: email
 *           example: KaranThakkarNEU
 *         account_created:
 *           type: string
 *           format: date-time
 *           example: 2016-08-29T09:12:33.001Z
 *           readOnly: true
 *         account_updated:
 *           type: string
 *           format: date-time
 *           example: 2016-08-29T09:12:33.001Z
 *           readOnly: true
 */

/**
 * @swagger
 * tags:
 *   name: Authenticated
 *   description: Operations available only to authenticated users
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Returns details of the user who is logged in
 *     tags: [Authenticated]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/self", checkContentLength, authMiddleware, getUser);
router.get("/verifyUser", verifyUser);

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create new user
 *     tags: [Public]
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.post("/", createUser);

/**
 * @swagger
 * /user:
 *   put:
 *     summary: Update user information
 *     tags: [Authenticated]
 *     responses:
 *       204:
 *         description: No content
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *                 x-properties: first_name, last_name, password, username
 */
router.put("/self", authMiddleware, updateUser);

router.all("/", (req, res) => {
  logger.error(`Invalid endpoint or method`, {
    severity: "ERROR",
  });

  res.status(405).send();
});
router.all("/self", (req, res) => {
  logger.error(`Invalid endpoint or method`, {
    severity: "ERROR",
  });

  res.status(405).send();
});

module.exports = router;
