import { HttpException, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/Task.entity';
import { Like, Repository } from 'typeorm';
import { TaskMember } from './entities/TaskMember.entity';
import { SubTask } from './entities/SubTask.entity';
import { TASK_STATUS } from 'src/common/enums/taskStatus.enum';
import { nanoid } from 'nanoid';

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
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(TaskMember)
    private taskUserRepository: Repository<TaskMember>,
    @InjectRepository(SubTask)
    private subTaskRepository: Repository<SubTask>,
  ) {}
  async create(model) {
    let {
      title,
      description,
      priority,
      dueDate,
      team,
      subTasks,
      user_id,
      projectId,
    } = model;
    try {
      if (!projectId)
        throw new HttpException(
          { status: 400, error: 'Project Id is mandatory' },
          400,
        );
      // creating task
      const task: Task = await this.taskRepository.create({
        title,
        description,
        priority,
        status: TASK_STATUS.ACTIVE,
        user_id,
        dueDate,
        projectId,
      });
      const saved = await this.taskRepository.save(task);
      let { id: task_id } = saved;
      // creating subtasks
      const subTasksPayload = subTasks.map((x) => ({
        title: x.text,
        task_id,
        id: nanoid(),
      }));
      const taskMemberPayload = team.map((x) => ({
        member_id: x,
        task_id,
        id: nanoid(),
      }));
      const subTasksCreate = await this.subTaskRepository
        .createQueryBuilder()
        .insert()
        .into(SubTask)
        .values(subTasksPayload)
        .execute();
      const teamMemberCreate = await this.taskUserRepository
        .createQueryBuilder()
        .insert()
        .into(TaskMember)
        .values(taskMemberPayload)
        .execute();

      return { message: 'New Task Created' };
    } catch (e) {
      console.log(e);
    }
  }

  async findAll({
    sort,
    order,
    search,
    limit = 10,
    page,
    id,
    user_id,
    projectId,
  }) {
    try {
      // const offset = limit * (page - 1);
      // const sortObj: any = { [sort]: order };
      let whereCond: any = { user_id };
      // if (search) {
      //   whereCond['title'] = Like(`%${search}%`);
      //   // whereCond['lastName'] =   search
      //   // whereCond['email'] =   search
      // }
      // console.log({
      //   where: whereCond,
      //   order: sortObj,
      //   skip: offset,
      //   take: limit
      // })
      const tasksResult = await this.taskRepository
        .createQueryBuilder('task')
        .where({
          user_id,
          projectId,
          // order: sortObj,
          // skip: +offset,
          // take: limit,
        })
        .innerJoinAndSelect('task.members', 'members')
        .innerJoinAndSelect('members.user', 'taskMember')
        .innerJoin('task.subTasks', 'subTasks')
        .select([
          'task.title',
          'task.id',
          'task.description',
          'subTasks',
          'taskMember.lastName',
          'taskMember.firstName',
          'taskMember.profileImage',
          'task.priority',
          'task.user_id',
          'task.dueDate',
          'task.status',
          'members',
        ])
        .getMany();
      const final = { active: [], inProgress: [], completed: [] };
      final.active = tasksResult.filter((x) => x.status === TASK_STATUS.ACTIVE);
      final.inProgress = tasksResult.filter((x) => {
        return x.status === TASK_STATUS.IN_PROGRESS;
      });
      final.completed = tasksResult.filter(
        (x) => x.status === TASK_STATUS.COMPLETED,
      );
      // // await new Promise(resolve => setTimeout(resolve, 2000));
      // const totalTasks = await this.taskRepository.count({
      //   // where: { user_id: id },
      // });
      return { data: final, totalTasks: tasksResult.length };
    } catch (e) {
      console.log(e);
    }
  }

  async findOne(attributeObj) {
    try {
      const task: any = await this.taskRepository
        .createQueryBuilder('task')
        .where({
          id: attributeObj.id,
          // order: sortObj,
          // skip: +offset,
          // take: limit,
        })
        .innerJoinAndSelect('task.members', 'members')
        .innerJoinAndSelect('members.user', 'taskMember')
        .innerJoinAndSelect('task.subTasks', 'subTasks')
        .getOne();
      return { data: task };
    } catch (e) {
      console.log(e);
    }
  }
  async update(id: string, model: any) {
    try {
      const user = await this.taskRepository.findOne({ where: { id } });
      if (!user) {
        throw new HttpException(
          { status: 400, error: 'Cannot find task' },
          400,
        );
      }
      Object.assign(user, model);
      const updatedEntity = await this.taskRepository.save(user);
      return { message: 'Task Updated' };
    } catch (e) {
      console.log(e);
    }
  }

  async remove(id: string) {
    try {
      const user = await this.taskRepository.findOne({ where: { id } });
      if (!user) {
        throw new HttpException(
          { status: 400, error: 'Cannot find task' },
          400,
        );
      }
      Object.assign(user, { is_active: false, status: TASK_STATUS.INACTIVE });
      const updatedEntity = await this.taskRepository.save(user);
      return updatedEntity;
    } catch (e) {
      console.log(e);
    }
  }
}
