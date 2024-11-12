import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { Project } from './entities/project.entity';
import { ProjectTeam } from './entities/projectTean.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../task/entities/Task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectTeam, Task])],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
