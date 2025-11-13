import request from "supertest";
import { testServer } from "../../test-server";
import { prisma } from "../../../src/data/postgres";

describe("TodosRoutes.ts", () => {
  beforeAll(async () => {
    await testServer.start();
  });

  beforeEach(async () => {
    await prisma.todo.deleteMany();
  });

  afterAll(() => {
    testServer.close();
  });

  const todo1 = {
    title: "Todo 1",
  };

  const todo2 = {
    title: "Todo 2",
  };

  it("should return TODOs api/todo", async () => {
    await prisma.todo.createMany({
      data: [todo1, todo2],
    });

    const response = await request(testServer.app)
      .get("/api/todos")
      .expect(200);

    expect(response.body).toHaveLength(2);
    expect(response.body[0].title).toBe(todo1.title);
    expect(response.body[1].title).toBe(todo2.title);
  });

  it("should return single TODO api/todo/:id", async () => {
    const todo = await prisma.todo.create({
      data: todo1,
    });

    const { body } = await request(testServer.app)
      .get(`/api/todos/${todo.id}`)
      .expect(200);

    expect(body.id).toEqual(todo.id);
  });

  it("should return 404 if TODO not found api/todo/:id", async () => {
    const { body } = await request(testServer.app)
      .get(`/api/todos/1000`)
      .expect(404);

    expect(body.ERROR).toBe("Todo with ID: 1000 not found");
  });

  it("should create a new TODO api/todo", async () => {
    const { body } = await request(testServer.app)
      .post(`/api/todos`)
      .send({ title: "New Todo" })
      .expect(201);

    expect(body.id).toBeDefined();
    expect(body.title).toBe("New Todo");
  });

  it("should return 400 if title is not provided api/todo", async () => {
    const { body } = await request(testServer.app)
      .post(`/api/todos`)
      .send({})
      .expect(400);

    expect(body.ERROR).toBe("Title is required");
  });

  it("should update a TODO api/todo/:id", async () => {
    const todo = await prisma.todo.create({
      data: todo1,
    });

    const { body } = await request(testServer.app)
      .patch(`/api/todos/${todo.id}`)
      .send({ title: "Updated Todo" })
      .expect(200);

    expect(body.id).toEqual(todo.id);
    expect(body.title).toBe("Updated Todo");
  });

  it("should return 400 if no fields are provided api/todo/:id", async () => {
    const todo = await prisma.todo.create({
      data: todo1,
    });

    const { body } = await request(testServer.app)
      .patch(`/api/todos/${todo.id}`)
      .send({})
      .expect(400);

    expect(body.ERROR).toBe(
      "At least one field (title or completedAt) must be provided"
    );
  });

  it("should return 404 if TODO not found api/todo/:id", async () => {
    const { body } = await request(testServer.app)
      .patch(`/api/todos/1000`)
      .send({ title: "Updated Todo" })
      .expect(404);

    expect(body.ERROR).toBe("Todo with ID: 1000 not found");
  });

  it("should delete a TODO api/todo/:id", async () => {
    const todo = await prisma.todo.create({
      data: todo1,
    });

    const { body } = await request(testServer.app)
      .delete(`/api/todos/${todo.id}`)
      .expect(200);

    expect(body.message).toBe(`Todo with ID: ${todo.id} deleted`);
    expect(body.todo.id).toEqual(todo.id);

    const todoFound = await prisma.todo.findUnique({
      where: {
        id: todo.id,
      },
    });

    expect(todoFound).toBeNull();
  });

  it("should return 404 if TODO not found api/todos/:id", async () => {
    const { body } = await request(testServer.app)
      .delete(`/api/todos/1000`)
      .expect(404);

    expect(body.ERROR).toBe("Todo with ID: 1000 not found");
  });
});
