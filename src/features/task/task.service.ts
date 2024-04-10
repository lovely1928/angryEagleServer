import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

const taskts = [
  {
    title: 'Task 1',
    description: 'Complete project proposal',
    unixTime: 1641932400000,
    status: false,
  },
  {
    title: 'Task 2',
    description: 'Read three chapters of a book',
    unixTime: 1642022400000,
    status: true,
  },
  {
    title: 'Task 3',
    description: 'Attend team meeting',
    unixTime: 1642112400000,
    status: false,
  },
  {
    title: 'Task 4',
    description: 'Write code for feature X',
    unixTime: 1642202400000,
    status: false,
  },
  {
    title: 'Task 5',
    description: 'Review and respond to emails',
    unixTime: 1642292400000,
    status: true,
  },
  {
    title: 'Task 6',
    description: 'Create presentation slides',
    unixTime: 1642382400000,
    status: false,
  },
  {
    title: 'Task 7',
    description: 'Exercise for 30 minutes',
    unixTime: 1642472400000,
    status: true,
  },
  {
    title: 'Task 8',
    description: 'Attend project review meeting',
    unixTime: 1642562400000,
    status: false,
  },
  {
    title: 'Task 9',
    description: 'Update project documentation',
    unixTime: 1642652400000,
    status: false,
  },
];
@Injectable()
export class TaskService {
  create(model) {
  try{

  }
  catch(e){
    
  }
  }

  findAll() {
    return `This action returns all task`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
