import { HttpException, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { ProjectTeam } from './entities/projectTean.entity';
import { Task } from '../task/entities/Task.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(ProjectTeam)
    private projectTeamRepository: Repository<ProjectTeam>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(payload) {
    try {
      const { title, description, team, userId } = payload;
      const projExist = await this.getOne({ filter: { title } });
      if (projExist) {
        throw new HttpException(
          { status: 400, error: 'Project already exists' },
          400,
        );
      }
      const newProj = await this.projectRepository.create({
        title,
        description,
        userId,
      });
      await this.projectRepository.save(newProj);
      // inserting team members
      await this.insertTeamMembers({
        projectId: newProj.id,
        team: [{ userId, role: 'owner' }, ...team],
      });

      return { message: 'Success', data: newProj };
    } catch (e) {
      console.log(e);
    }
  }

  async insertTeamMembers({ projectId, team }) {
    try {
      const payload = team.map((x) => {
        return {
          projectId,
          userId: x.userId,
          customRole: x?.customRole || 'member',
        };
      });
      const result = await this.projectTeamRepository.create(payload);
      await this.projectTeamRepository.save(result);
      return { message: 'Success' };
    } catch (e) {
      console.log(e);
    }
  }

  // async findAll(payload) {
  //   try {
  //     const { userId } = payload;
  //     const list: any = await this.projectRepository.find({
  //       where: { userId: userId, isActive: true },
  //     });
  //     const q = `
  //     select
  //     	COUNT(*) as count,
  //     	t.status as status,
  //     	t.projectId as projectId
  //     from task t
  //     where t.user_id = '${userId}'
  //     group by t.status, t.projectId
  //     `;

  //     const countData = await this.taskRepository.query(q);

  //     for (let proj of list) {
  //       const stat = countData.filter((x) => x.projectId === proj.id);
  //       proj.stats = stat;
  //     }
  //     return { data: list };
  //   } catch (e) {
  //     console.log(e);
  //   }
  //   return `This action returns all project`;
  // }

  async findAll(payload) {
    const { sort, userId, order, search, limit = 10, page } = payload;
    try {
      const offset = limit * (page - 1);
      const sortObj: any = { [sort]: order };
      let whereCond: any = { userId: userId, isActive: true };
      if (search) {
        whereCond['title'] = Like(`%${search}%`);
        // whereCond['lastName'] =   search
        // whereCond['email'] =   search
      }
      // console.log({
      //   where: whereCond,
      //   order: sortObj,
      //   skip: offset,
      //   take: limit
      // })
      const users = await this.projectRepository.find({
        where: whereCond,
        order: sortObj,
        skip: +offset,
        take: limit,
      });
      // await new Promise(resolve => setTimeout(resolve, 2000));
      const totalProjects = await this.projectRepository.count();
      return { data: users, totalProjects };
    } catch (e) {
      console.log(e);
    }
  }

  async findOne(id: string) {
    try {
      const proj = await this.getOne({ filter: { id } });
      const q = `
      SELECT
        u.id AS id,
        u.profileImage AS profileImage, 
        u.firstName AS firstName,
        u.lastName AS lastName
      FROM project_team pt
      JOIN user u
      ON u.id = pt.userId
      WHERE projectId = ?
      `;
      const projMembers = await this.projectTeamRepository.query(q, [id]);
      return { data: { ...proj, team: projMembers } };
    } catch (e) {
      console.log(e);
    }
  }

  async getOne(payload) {
    try {
      const { filter, projection } = payload;
      const project = await this.projectRepository.findOne({ where: filter });
      return project;
    } catch (e) {
      console.log(e);
    }
  }

  update(id: string, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: string) {
    return `This action removes a #${id} project`;
  }
}
