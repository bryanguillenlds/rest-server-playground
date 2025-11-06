import { CreateTodoDto, TodoEntity, UpdateTodoDto } from "../../domain";
import { TodoDatasource } from "../../domain/datasources/todo.datasource";
import { TodoRepository } from "../../domain/repositories/todo.repository";

export class TodoRepositoryImpl implements TodoRepository {
  constructor(private readonly todoDatasource: TodoDatasource) {}

  create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
    return this.todoDatasource.create(createTodoDto);
  }

  getAll(): Promise<TodoEntity[]> {
    return this.todoDatasource.getAll();
  }

  findById(id: number): Promise<TodoEntity> {
    return this.todoDatasource.findById(id);
  }

  updateById(id: number, updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
    return this.todoDatasource.updateById(id, updateTodoDto);
  }

  deleteById(id: number): Promise<TodoEntity> {
    return this.todoDatasource.deleteById(id);
  }
}
