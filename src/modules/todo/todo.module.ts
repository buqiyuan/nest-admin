import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TodoController } from './todo.controller'
import { TodoEntity } from './todo.entity'
import { TodoService } from './todo.service'

const services = [TodoService]

@Module({
  imports: [TypeOrmModule.forFeature([TodoEntity])],
  controllers: [TodoController],
  providers: [...services],
  exports: [TypeOrmModule, ...services],
})
export class TodoModule {}
