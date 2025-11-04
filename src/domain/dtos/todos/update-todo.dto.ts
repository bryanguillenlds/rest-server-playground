export class UpdateTodoDto {
  constructor(public readonly id: number, public readonly title?: string) {}

  static create(props: { [key: string]: any }): [string?, UpdateTodoDto?] {
    const { id, title } = props;

    // Validate ID is provided
    if (id === undefined) {
      return ["ID is required", undefined];
    }

    // Validate ID is a number
    const numericId = typeof id === "string" ? +id : id;

    if (isNaN(numericId)) {
      return ["ID is not a number", undefined];
    }

    if (numericId <= 0) {
      return ["ID must be a positive number", undefined];
    }

    // Validate title if provided
    if (title !== undefined) {
      if (typeof title !== "string") {
        return ["Title must be a string", undefined];
      }

      if (title.trim().length === 0) {
        return ["Title cannot be empty", undefined];
      }
    }

    return [undefined, new UpdateTodoDto(numericId, title)];
  }
}
