const request = require("supertest");
const server = require("../index");
const User = require("../api/models/user");
const sequelize = require("../api/config/database");
const bcrypt = require("bcrypt");
require("dotenv").config();

describe("User APIs", () => {
  const dummyData = {
    first_name: "Karan",
    last_name: "Thakkar",
    username: "karanthakkar@northeastern.edu",
    password: "Karan@api123",
  };

  describe("POST /v1/user", () => {
    it("should create a new user", async () => {
      try {
        const response = await request(server)
          .post("/v1/user")
          .send(dummyData)
          .expect(201);

        expect(response.body).toMatchObject({
          first_name: dummyData.first_name,
          last_name: dummyData.last_name,
          username: dummyData.username,
          account_created: expect.any(String),
          account_updated: expect.any(String),
        });
      } catch (error) {
        console.error(error);
        throw error;
      }
    });

    it("should get the user details", async () => {
      try {
        await request(server)
          .get("/v1/user/self")
          .auth(dummyData.username, dummyData.password)
          .expect(200);

        const userDetails = await User.findOne({
          where: { username: dummyData.username },
        });

        expect(userDetails).toBeTruthy();
      } catch (error) {
        console.error(error);
        throw error;
      }
    });
  });

  describe("PUT v1/user/self", () => {
    const updatedDetails = {
      first_name: "KaranC",
      last_name: "ThakkarC",
      password: "KaranT@api123",
    };

    it("should update the user details", async () => {
      try {
        await request(server)
          .put("/v1/user/self")
          .auth(dummyData.username, dummyData.password)
          .send(updatedDetails)
          .expect(204);
      } catch (error) {
        console.error(error);
        throw error;
      }
    });

    it("should get the user details", async () => {
      try {
        const response = await request(server)
          .get("/v1/user/self")
          .auth(dummyData.username, updatedDetails.password)
          .expect(200);

        const userDetails = await User.findOne({
          where: { username: "karanthakkar@northeastern.edu" },
        });

        const isPasswordValid = bcrypt.compareSync(
          updatedDetails.password,
          userDetails.password
        );

        expect(isPasswordValid).toBe(true);

        expect(response.body).toMatchObject({
          first_name: updatedDetails.first_name,
          last_name: updatedDetails.last_name,
          username: dummyData.username,
          account_created: expect.any(String),
          account_updated: expect.any(String),
        });
      } catch (error) {
        console.error(error);
        throw error;
      }
    });
  });
});

beforeAll(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error;
  }
});

afterAll(async () => {
  try {
    await User.destroy({ where: {}, truncate: true });
    await sequelize.close();
  } catch (error) {
    console.error("Unable to close the database:", error);
    throw error;
  }
});
