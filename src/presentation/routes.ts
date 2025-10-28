import { Router } from "express";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.get("/api/todos", (req, res) => {
      res.json([
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
      ]);
    });

    return router;
  }
}
