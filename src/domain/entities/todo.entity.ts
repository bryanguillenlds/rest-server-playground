export class TodoEntity {
  constructor(
    public id: number,
    public title: string,
    public createdAt: Date,
    public updatedAt: Date,
    public completedAt?: boolean
  ) {}

  get isCompleted(): boolean {
    return this.completedAt ?? false;
  }

  public static fromObject(object: { [key: string]: any }): TodoEntity {
    const { id, title, createdAt, updatedAt, completedAt } = object;
    if (!id) throw new Error("Id is required");
    if (!title) throw new Error("Title is required");
    if (completedAt !== undefined && typeof completedAt !== "boolean") {
      throw new Error("CompletedAt must be a boolean");
    }

    // Convert dates if they're strings (from JSON serialization)
    const createdDate =
      createdAt instanceof Date ? createdAt : new Date(createdAt);
    const updatedDate =
      updatedAt instanceof Date ? updatedAt : new Date(updatedAt);

    if (isNaN(createdDate.getTime())) {
      throw new Error("Invalid date format for createdAt");
    }

    if (isNaN(updatedDate.getTime())) {
      throw new Error("Invalid date format for updatedAt");
    }

    return new TodoEntity(id, title, createdDate, updatedDate, completedAt);
  }
}
