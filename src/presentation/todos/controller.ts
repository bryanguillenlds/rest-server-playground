import { Request, Response } from "express";
import { CreateTodoDto } from "../../domain/dtos";
import { UpdateTodoDto } from "../../domain/dtos";
import { TodoRepository } from "../../domain/repositories/todo.repository";
import { GetTodosUseCaseImpl } from "../../domain/use-cases/todos/get-todos";
import { GetTodoUseCaseImpl } from "../../domain/use-cases/todos/get-todo";
import { CreateTodoUseCaseImpl } from "../../domain/use-cases/todos/create-todos";
import { UpdateTodoUseCaseImpl } from "../../domain/use-cases/todos/update-todos";
import { DeleteTodoUseCaseImpl } from "../../domain";

export class TodosController {
  //* DI
  constructor(private readonly todoRepository: TodoRepository) {}

  //* GET /api/todos
  public getTodos = (req: Request, res: Response) => {
    new GetTodosUseCaseImpl(this.todoRepository)
      .execute()
      .then((todos) => {
        return res.status(200).json(todos);
      })
      .catch((error) => {
        if (error instanceof Error && error.message.includes("not found")) {
          return res.status(404).json({ ERROR: error.message });
        }

        return res.status(500).json({ ERROR: "Internal server error" });
      });
  };

  public getTodoById = (req: Request, res: Response) => {
    const id = +req.params.id;

    new GetTodoUseCaseImpl(this.todoRepository)
      .execute(id)
      .then((todo) => {
        return res.status(200).json(todo);
      })
      .catch((error) => {
        if (error instanceof Error && error.message.includes("not found")) {
          return res.status(404).json({ ERROR: error.message });
        }

        return res.status(500).json({ ERROR: "Internal server error" });
      });
  };

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
        if (error instanceof Error && error.message.includes("not found")) {
          return res.status(404).json({ ERROR: error.message });
        }

        return res.status(500).json({ ERROR: "Internal server error" });
      });
  };

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
        if (error instanceof Error && error.message.includes("not found")) {
          return res.status(404).json({ ERROR: error.message });
        }

        return res.status(500).json({ ERROR: "Internal server error" });
      });
  };

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
        if (error instanceof Error && error.message.includes("not found")) {
          return res.status(404).json({ ERROR: error.message });
        }

        return res.status(500).json({ ERROR: "Internal server error" });
      });
  };
}
