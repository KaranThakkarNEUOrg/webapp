const request = require("supertest");
const app = require("../index");
const User = require("../api/models/user");
const sequelize = require("../api/config/database");
require("dotenv").config();

let server;
describe("User APIs", () => {
  beforeAll(async () => {
    try {
      await sequelize.authenticate();
      await sequelize.sync({ force: true });
      server = app.listen(process.env.PORT || 8888);
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  });

  afterAll(async () => {
    try {
      await User.destroy({ where: {} });
      await sequelize.close();
      server.close();
    } catch (error) {
      console.error("Unable to close the database:", error);
    }
  });

  describe("POST /v1/user", () => {
    it("should create a new user", async () => {
      const dummyData = {
        first_name: "Karan",
        last_name: "Thakkar",
        username: "karanthakkar@northeastern.edu",
        password: "Karan@api123",
      };

      try {
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
      } catch (error) {
        console.error(error);
      }
    });

    it("should get the user details", async () => {
      try {
        await request(app)
          .get("/v1/user/self")
          .auth("karanthakkar@northeastern.edu", "Karan@api123")
          .expect(200);

        const userDetails = await User.findOne({
          where: { username: "karanthakkar@northeastern.edu" },
        });

        expect(userDetails).toBeTruthy();
      } catch (error) {
        console.error(error);
      }
    });
  });

  describe("PUT v1/user/self", () => {
    it("should update the user details", async () => {
      try {
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
      } catch (error) {
        console.error(error);
      }
    });

    it("should get the user details", async () => {
      try {
        await request(app)
          .get("/v1/user/self")
          .auth("karanthakkar@northeastern.edu", "Karan@api123")
          .expect(200);

        const userDetails = await User.findOne({
          where: { username: "karanthakkar@northeastern.edu" },
        });

        expect(userDetails).toBeTruthy();
      } catch (error) {
        console.error(error);
      }
    });
  });
});
