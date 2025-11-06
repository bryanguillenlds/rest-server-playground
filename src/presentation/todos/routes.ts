import { Router } from "express";
import { TodosController } from "./controller";
import { TodoRepositoryImpl } from "../../infrastructure/repositories/todo.repository.impl";
import { TodoDatasourceImpl } from "../../infrastructure/datasource/todo.datasource.impl";

export class TodosRoutes {
  static get routes(): Router {
    const router = Router();

    const todoDatasource = new TodoDatasourceImpl(); // Repository pattern allows us to change this datasource without changing the controller
    const todoRepository = new TodoRepositoryImpl(todoDatasource);

    const todosController = new TodosController(todoRepository);

    router.get("/", todosController.getTodos);
    router.get("/:id", todosController.getTodoById);
    router.post("/", todosController.createTodo);
    router.patch("/:id", todosController.updateTodo);
    router.delete("/:id", todosController.deleteTodo);

    return router;
  }
}
