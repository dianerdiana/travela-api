import supertest from "supertest";
import { createServer } from "../src/server";

describe("Authentication", () => {
  it("status check returns 200", async () => {
    const userData = {
      avatar: "",
      fullName: "A",
    };

    await supertest(createServer())
      .post("/register")
      .send(userData)
      .then((res) => {
        expect(res.status).toBe(201);
      });
  });
});
