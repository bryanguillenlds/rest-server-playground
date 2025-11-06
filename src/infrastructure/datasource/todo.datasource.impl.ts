import { TodoDatasource } from "../../domain/datasources/todo.datasource";
import { CreateTodoDto, TodoEntity, UpdateTodoDto } from "../../domain";
import { prisma } from "../../data/postgres";

export class TodoDatasourceImpl extends TodoDatasource {
  async create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
    const todo = await prisma.todo.create({
      data: {
        title: createTodoDto.title,
      },
    });

    return TodoEntity.fromObject(todo);
  }

  async getAll(): Promise<TodoEntity[]> {
    const todos = await prisma.todo.findMany();

    return todos.map((todo) => TodoEntity.fromObject(todo));
  }

  async findById(id: number): Promise<TodoEntity> {
    const todo = await prisma.todo.findUnique({
      where: {
        id,
      },
    });

    if (!todo) throw new Error(`Todo with ID: ${id} not found`);

    return TodoEntity.fromObject(todo);
  }

  async updateById(
    id: number,
    updateTodoDto: UpdateTodoDto
  ): Promise<TodoEntity> {
    const todo = await this.findById(updateTodoDto.id);

    if (!todo) throw new Error(`Todo with ID: ${id} not found`);

    // Build update data object
    const updateData: { title?: string; completedAt?: boolean } = {};

    // Only include title if it's provided and different
    if (updateTodoDto!.title !== undefined) {
      if (todo.title !== updateTodoDto!.title) {
        updateData.title = updateTodoDto!.title;
      }
    }

    // Include completedAt if provided
    if (updateTodoDto!.completedAt !== undefined) {
      updateData.completedAt = updateTodoDto!.completedAt;
    }

    // Update the todo (updatedAt will automatically update via Prisma's @updatedAt)
    const updatedTodo = await prisma.todo.update({
      where: {
        id: updateTodoDto!.id,
      },
      data: updateData,
    });

    return TodoEntity.fromObject(updatedTodo);
  }

  async deleteById(id: number): Promise<TodoEntity> {
    const todo = await this.findById(id);

    if (!todo) throw new Error(`Todo with ID: ${id} not found`);

    const deletedTodo = await prisma.todo.delete({
      where: {
        id,
      },
    });

    return TodoEntity.fromObject(deletedTodo);
  }
}
