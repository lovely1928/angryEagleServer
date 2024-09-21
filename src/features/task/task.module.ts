import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { Task } from './entities/Task.entity';
import { TaskMember } from './entities/TaskMember.entity';
import { SubTask } from './entities/SubTask.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Task, TaskMember, SubTask])],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
