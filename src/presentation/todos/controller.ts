import { Request, Response } from "express";

const todos = [
  {
    id: 1,
    title: "Buy a car",
    createdAt: new Date(),
  },
  {
    id: 2,
    title: "Buy a house",
    createdAt: null,
  },
  {
    id: 3,
    title: "Buy a boat",
    createdAt: new Date(),
  },
];
export class TodosController {
  //* DI
  constructor() {}

  //* GET /api/todos
  public getTodos = (req: Request, res: Response) => {
    return res.json(todos);
  };

  public getTodoById = (req: Request, res: Response) => {
    const id = +req.params.id;

    if (isNaN(id)) {
      return res.status(400).json({ ERROR: `ID is not a number` });
    }

    const todo = todos.find((todo) => todo.id === id);

    if (!todo) {
      return res.status(404).json({ ERROR: `Todo with ID: ${id} not found` });
    }

    return res.json(todo);
  };

  public createTodo = (req: Request, res: Response) => {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ ERROR: `Title is required` });
    }

    const newTodo = {
      id: todos.length + 1,
      title,
      createdAt: new Date(),
    };

    todos.push(newTodo);

    return res.status(201).json(newTodo);
  };
}
