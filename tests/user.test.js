const request = require("supertest");
const app = require("../index");
const User = require("../api/models/user");
const bcrypt = require("bcrypt");
require("dotenv").config();

describe("User APIs", () => {
  afterAll(async () => {
    await User.destroy({ where: {} });
  });

  describe("POST /v1/user", () => {
    it("should create a new user", async () => {
      const dummyData = {
        first_name: "Karan",
        last_name: "Thakkar",
        username: "karanthakkar@northeastern.edu",
        password: "Karan@api123",
      };

      const response = await request(app)
        .post("/v1/user")
        .send(dummyData)
        .expect(201);

      expect(response.body).toMatchObject({
        first_name: "Karan",
        last_name: "Thakkar",
        username: "karanthakkar@northeastern.edu",
        account_created: expect.any(String),
        account_updated: expect.any(String),
      });
    });

    it("should get the user details", async () => {
      await request(app)
        .get("/v1/user/self")
        .auth("karanthakkar@northeastern.edu", "Karan@api123")
        .expect(200);

      const userDetails = await User.findOne({
        where: { username: "karanthakkar@northeastern.edu" },
      });

      expect(userDetails).toBeTruthy();
    });
  });

  describe("PUT v1/user/self", () => {
    it("should update the user details", async () => {
      const updatedDetails = {
        first_name: "KaranC",
        last_name: "ThakkarC",
        password: "Karan@api123",
      };

      await request(app)
        .put("/v1/user/self")
        .auth("karanthakkar@northeastern.edu", "Karan@api123")
        .send(updatedDetails)
        .expect(204);
    });

    it("should get the user details", async () => {
      await request(app)
        .get("/v1/user/self")
        .auth("karanthakkar@northeastern.edu", "Karan@api123")
        .expect(200);

      const userDetails = await User.findOne({
        where: { username: "karanthakkar@northeastern.edu" },
      });

      expect(userDetails).toBeTruthy();
    });
  });
});
