import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CourseRepository } from "../../../domain/repositories/course.repository";
import { Course } from "../../../domain/entities/course.entity";
import { CourseTypeormEntity } from "../entities/course.typeorm-entity";

@Injectable()
export class PostgresCourseRepository implements CourseRepository {
  constructor(
    @InjectRepository(CourseTypeormEntity)
    private readonly repo: Repository<CourseTypeormEntity>,
  ) {}

  private toDomain(entity: CourseTypeormEntity): Course {
    return new Course(
      entity.id,
      entity.nombre,
      entity.codigoNrc,
      entity.periodoAcademico,
      entity.profesorResponsableId,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  async findAll(): Promise<Course[]> {
    const all = await this.repo.find();
    return all.map((e) => this.toDomain(e));
  }

  async findByStudent(studentId: number): Promise<Course[]> {
    const all = await this.repo
      .createQueryBuilder("course")
      .innerJoin("course.enrollments", "enrollment")
      .where("enrollment.student_id = :studentId", { studentId })
      .getMany();
    return all.map((e) => this.toDomain(e));
  }

  async findById(id: number): Promise<Course | null> {
    const found = await this.repo.findOne({ where: { id } });
    return found ? this.toDomain(found) : null;
  }

  async findByProfessor(professorId: number): Promise<Course[]> {
    const all = await this.repo.find({ where: { profesorResponsableId: professorId } });
    return all.map((e) => this.toDomain(e));
  }

  async save(course: Course): Promise<Course> {
    const saved = await this.repo.save({
      nombre: course.nombre,
      codigoNrc: course.codigoNrc,
      periodoAcademico: course.periodoAcademico,
      profesorResponsableId: course.profesorResponsableId,
    });
    return this.toDomain(saved);
  }

  async update(course: Course): Promise<Course> {
    const existing = await this.repo.findOne({ where: { id: course.id } });
    if (!existing) throw new Error(`Course with id ${course.id} not found`);

    const merged = this.repo.merge(existing, {
      nombre: course.nombre,
      codigoNrc: course.codigoNrc,
      periodoAcademico: course.periodoAcademico,
      profesorResponsableId: course.profesorResponsableId,
    });
    const saved = await this.repo.save(merged);
    return this.toDomain(saved);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
