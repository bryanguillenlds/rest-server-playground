import { TodoEntity } from "../../entities/todo.entity";
import { CreateTodoDto } from "../../dtos";
import { TodoRepository } from "../../repositories/todo.repository";

export interface CreateTodoUseCase {
  execute(createTodoDto: CreateTodoDto): Promise<TodoEntity>;
}

export class CreateTodoUseCaseImpl implements CreateTodoUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  execute(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
    return this.todoRepository.create(createTodoDto);
  }
}
