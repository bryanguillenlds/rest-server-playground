import request from "supertest";
import { testServer } from "../../test-server";

describe("TodosRoutes.ts", () => {
  beforeAll(async () => {
    await testServer.start();
  });

  afterAll(() => {
    testServer.close();
  });

  it("should return TODOs api/todo", async () => {
    const response = await request(testServer.app)
      .get("/api/todos")
      .expect(200);
  });
});
