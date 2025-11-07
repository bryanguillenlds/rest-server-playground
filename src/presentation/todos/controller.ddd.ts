import { Request, Response } from "express";
import { CreateTodoDto } from "../../domain/dtos";
import { UpdateTodoDto } from "../../domain/dtos";
import { TodoRepository } from "../../domain/repositories/todo.repository";

export class TodosControllerDDD {
  //* DI
  constructor(private readonly todoRepository: TodoRepository) {}

  //* GET /api/todos
  public getTodos = async (req: Request, res: Response) => {
    const todos = await this.todoRepository.getAll();
    return res.json(todos);
  };

  public getTodoById = async (req: Request, res: Response) => {
    const id = +req.params.id;

    try {
      const todo = await this.todoRepository.findById(id);
      return res.json(todo);
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        return res.status(404).json({ ERROR: error.message });
      }

      return res.status(500).json({ ERROR: "Internal server error" });
    }
  };

  public createTodo = async (req: Request, res: Response) => {
    const [error, createTodoDto] = CreateTodoDto.create(req.body);

    if (error) {
      return res.status(400).json({ ERROR: error });
    }

    const todo = await this.todoRepository.create(createTodoDto!);

    return res.status(201).json(todo);
  };

  public updateTodo = async (req: Request, res: Response) => {
    const [error, updateTodoDto] = UpdateTodoDto.create({
      ...req.body,
      id: req.params.id,
    });

    if (error) {
      return res.status(400).json({ ERROR: error });
    }

    try {
      const updatedTodo = await this.todoRepository.updateById(
        updateTodoDto!.id,
        updateTodoDto!
      );

      return res.json(updatedTodo);
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        return res.status(404).json({ ERROR: error.message });
      }

      return res.status(500).json({ ERROR: "Internal server error" });
    }
  };

  public deleteTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;

    if (isNaN(id)) {
      return res.status(400).json({ ERROR: `ID is not a number` });
    }

    try {
      const deletedTodo = await this.todoRepository.deleteById(id);

      return res
        .status(200)
        .json({ message: `Todo with ID: ${id} deleted`, deletedTodo });
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        return res.status(404).json({ ERROR: error.message });
      }
      return res.status(500).json({ ERROR: "Internal server error" });
    }
  };
}
