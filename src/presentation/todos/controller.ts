import { Request, Response } from "express";
import { prisma } from "../../data/postgres";

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
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ ERROR: `Title is required` });
    }

    const todo = await prisma.todo.create({
      data: {
        title,
      },
    });

    return res.status(201).json(todo);
  };

  public updateTodo = async (req: Request, res: Response) => {
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

    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ ERROR: `Title is required` });
    }

    // Only update if the title actually changed
    // We allow the req to come through but we don't update so we stay idempotent
    if (todo.title === title) {
      return res.json(todo); // Return existing todo without updating
    }

    const updatedTodo = await prisma.todo.update({
      where: {
        id,
      },
      data: {
        title,
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
