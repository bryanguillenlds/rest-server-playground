import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto } from "../../domain/dtos";
import { UpdateTodoDto } from "../../domain/dtos";

export class TodosController {
  //* DI
  constructor() {}

  //* GET /api/todos
  public getTodos = async (req: Request, res: Response) => {
    const todos = await prisma.todo.findMany();
    return res.json(todos);
  };

  public getTodoById = async (req: Request, res: Response) => {
    const id = +req.params.id;

    if (isNaN(id)) {
      return res.status(400).json({ ERROR: `ID is not a number` });
    }

    const todo = await prisma.todo.findUnique({
      where: {
        id,
      },
    });

    if (!todo) {
      return res.status(404).json({ ERROR: `Todo with ID: ${id} not found` });
    }

    return res.json(todo);
  };

  public createTodo = async (req: Request, res: Response) => {
    const [error, createTodoDto] = CreateTodoDto.create(req.body);

    if (error) {
      return res.status(400).json({ ERROR: error });
    }

    const todo = await prisma.todo.create({
      data: {
        title: createTodoDto!.title,
      },
    });

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

    const todo = await prisma.todo.findUnique({
      where: {
        id: updateTodoDto!.id,
      },
    });

    if (!todo) {
      return res
        .status(404)
        .json({ ERROR: `Todo with ID: ${updateTodoDto!.id} not found` });
    }

    // Only update if the title actually changed
    // We allow the req to come through but we don't update so we stay idempotent
    // If no title provided, return existing todo (no-op)
    if (!updateTodoDto!.title) {
      return res.json(todo);
    }

    if (todo.title === updateTodoDto!.title) {
      return res.json(todo); // Return existing todo without updating
    }

    const updatedTodo = await prisma.todo.update({
      where: {
        id: updateTodoDto!.id,
      },
      data: {
        title: updateTodoDto!.title,
      },
    });

    return res.json(updatedTodo);
  };

  public deleteTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;

    if (isNaN(id)) {
      return res.status(400).json({ ERROR: `ID is not a number` });
    }

    const todo = await prisma.todo.findUnique({
      where: {
        id,
      },
    });

    if (!todo) {
      return res.status(404).json({ ERROR: `Todo with ID: ${id} not found` });
    }

    const deletedTodo = await prisma.todo.delete({
      where: {
        id,
      },
    });

    if (!deletedTodo) {
      return res
        .status(400)
        .json({ ERROR: `Not Possible to delete Todo with ID: ${id}` });
    }

    return res
      .status(200)
      .json({ message: `Todo with ID: ${id} deleted`, deletedTodo });
  };
}
