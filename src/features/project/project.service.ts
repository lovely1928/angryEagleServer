import { HttpException, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { ProjectTeam } from './entities/projectTean.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(ProjectTeam)
    private projectTeamRepository: Repository<ProjectTeam>,
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
      if (team.length > 0) {
        await this.insertTeamMembers({ projectId: newProj.id, team });
      }
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

  async findAll(payload) {
    try {
      const { userId } = payload;
      const list = await this.projectRepository.find({
        where: { userId: userId, isActive: true },
      });
      return { data: list };
    } catch (e) {
      console.log(e);
    }
    return `This action returns all project`;
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
