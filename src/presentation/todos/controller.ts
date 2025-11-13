import { Request, Response } from "express";
import { CreateTodoDto } from "../../domain/dtos";
import { UpdateTodoDto } from "../../domain/dtos";
import { TodoRepository } from "../../domain/repositories/todo.repository";
import { GetTodosUseCaseImpl } from "../../domain/use-cases/todos/get-todos";
import { GetTodoUseCaseImpl } from "../../domain/use-cases/todos/get-todo";
import { CreateTodoUseCaseImpl } from "../../domain/use-cases/todos/create-todos";
import { UpdateTodoUseCaseImpl } from "../../domain/use-cases/todos/update-todos";
import { CustomError, DeleteTodoUseCaseImpl } from "../../domain";

export class TodosController {
  //* DI
  constructor(private readonly todoRepository: TodoRepository) {}

  // This is so that we can handle our own custom errors and also errors that are not our own
  private handleError(response: Response, error: unknown) {
    if (error instanceof CustomError) {
      return response.status(error.statusCode).json({ ERROR: error.message });
    }

    return response.status(500).json({ ERROR: "Internal server error" });
  }

  //* GET /api/todos
  public getTodos = (req: Request, res: Response) => {
    new GetTodosUseCaseImpl(this.todoRepository)
      .execute()
      .then((todos) => {
        return res.status(200).json(todos);
      })
      .catch((error) => {
        return this.handleError(res, error);
      });
  };

  //* GET /api/todos/:id
  public getTodoById = (req: Request, res: Response) => {
    const id = +req.params.id;

    new GetTodoUseCaseImpl(this.todoRepository)
      .execute(id)
      .then((todo) => {
        return res.status(200).json(todo);
      })
      .catch((error) => {
        return this.handleError(res, error);
      });
  };

  //* POST /api/todos
  public createTodo = (req: Request, res: Response) => {
    const [error, createTodoDto] = CreateTodoDto.create(req.body);

    if (error) {
      return res.status(400).json({ ERROR: error });
    }

    new CreateTodoUseCaseImpl(this.todoRepository)
      .execute(createTodoDto!)
      .then((todo) => {
        return res.status(201).json(todo);
      })
      .catch((error) => {
        return this.handleError(res, error);
      });
  };

  //* PATCH /api/todos/:id
  public updateTodo = (req: Request, res: Response) => {
    const [error, updateTodoDto] = UpdateTodoDto.create({
      ...req.body,
      id: req.params.id,
    });

    if (error) {
      return res.status(400).json({ ERROR: error });
    }

    new UpdateTodoUseCaseImpl(this.todoRepository)
      .execute(updateTodoDto!)
      .then((todo) => {
        return res.status(200).json(todo);
      })
      .catch((error) => {
        return this.handleError(res, error);
      });
  };

  //* DELETE /api/todos/:id
  public deleteTodo = (req: Request, res: Response) => {
    const id = +req.params.id;

    if (isNaN(id)) {
      return res.status(400).json({ ERROR: `ID is not a number` });
    }

    new DeleteTodoUseCaseImpl(this.todoRepository)
      .execute(id)
      .then((todo) => {
        return res
          .status(200)
          .json({ message: `Todo with ID: ${id} deleted`, todo });
      })
      .catch((error) => {
        return this.handleError(res, error);
      });
  };
}
