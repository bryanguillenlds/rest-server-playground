import { TodoEntity } from "../../entities/todo.entity";
import { CreateTodoDto, UpdateTodoDto } from "../../dtos";
import { TodoRepository } from "../../repositories/todo.repository";

export interface UpdateTodoUseCase {
  execute(updateTodoDto: UpdateTodoDto): Promise<TodoEntity>;
}

export class UpdateTodoUseCaseImpl implements UpdateTodoUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  execute(updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
    return this.todoRepository.updateById(updateTodoDto.id, updateTodoDto);
  }
}
