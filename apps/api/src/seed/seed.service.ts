import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";

import { UserRepository, USER_REPOSITORY } from "../domain/repositories/user.repository";
import { CourseRepository, COURSE_REPOSITORY } from "../domain/repositories/course.repository";
import { ChallengeRepository, CHALLENGE_REPOSITORY } from "../domain/repositories/challenge.repository";
import { User } from "../domain/entities/user.entity";
import { Course } from "../domain/entities/course.entity";
import { Challenge } from "../domain/entities/challenge.entity";
import { EnrollmentTypeormEntity } from "../infrastructure/persistence/entities/enrollment.typeorm-entity";
import { Role } from "../domain/enums/role.enum";
import { ChallengeDifficulty } from "../domain/enums/challenge-difficulty.enum";
import { ChallengeStatus } from "../domain/enums/challenge-status.enum";

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepository,
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepo: CourseRepository,
    @Inject(CHALLENGE_REPOSITORY)
    private readonly challengeRepo: ChallengeRepository,
    // Excepción pragmática: Enrollment no tiene repositorio de dominio aún
    @InjectRepository(EnrollmentTypeormEntity)
    private readonly enrollmentRepo: Repository<EnrollmentTypeormEntity>,
  ) {}

  async seed(): Promise<void> {
    this.logger.log("🌱 Starting seed...");

    // ── Users ──────────────────────────────────────────────
    const [adminPw, professorPw, studentPw] = await Promise.all([
      bcrypt.hash("Admin123!", 10),
      bcrypt.hash("Prof1234!", 10),
      bcrypt.hash("Estudiante1!", 10),
    ]);

    const usersData = [
      { nombre: "Admin QueryHub", email: "admin@queryhub.com", password: adminPw, role: Role.ADMIN },
      { nombre: "Prof. María García", email: "maria.garcia@universidad.edu", password: professorPw, role: Role.PROFESSOR },
      { nombre: "Carlos López", email: "carlos.lopez@universidad.edu", password: studentPw, role: Role.STUDENT },
      { nombre: "Ana Martínez", email: "ana.martinez@universidad.edu", password: studentPw, role: Role.STUDENT },
    ];

    const users: User[] = [];
    for (const u of usersData) {
      const existing = await this.userRepo.findByEmail(u.email);
      if (!existing) {
        const saved = await this.userRepo.save(
          new User(null, u.nombre, u.email, u.password, u.role, new Date(), new Date()),
        );
        this.logger.log(`  ✅ User created: ${u.email} (${u.role})`);
        users.push(saved);
      } else {
        this.logger.log(`  ⏭️  User skipped (exists): ${u.email}`);
        users.push(existing);
      }
    }

    const [admin, professor, student1, student2] = users;

    // ── Courses ────────────────────────────────────────────
    const coursesData = [
      { nombre: "Bases de Datos I", codigoNrc: "NRC-1001", periodoAcademico: "2024-1", profesorResponsableId: professor.id },
      { nombre: "SQL Avanzado", codigoNrc: "NRC-1002", periodoAcademico: "2024-1", profesorResponsableId: professor.id },
    ];

    const existingCourses = await this.courseRepo.findAll();
    const courses: Course[] = [];
    for (const c of coursesData) {
      const found = existingCourses.find((e) => e.codigoNrc === c.codigoNrc);
      if (!found) {
        const saved = await this.courseRepo.save(
          new Course(null, c.nombre, c.codigoNrc, c.periodoAcademico, c.profesorResponsableId, new Date(), new Date()),
        );
        this.logger.log(`  ✅ Course created: ${c.nombre}`);
        courses.push(saved);
      } else {
        this.logger.log(`  ⏭️  Course skipped (exists): ${c.nombre}`);
        courses.push(found);
      }
    }

    const [course1, course2] = courses;

    // ── Enrollments ───────────────────────────────────────
    const enrollmentsData = [
      { studentId: student1.id, courseId: course1.id },
      { studentId: student1.id, courseId: course2.id },
      { studentId: student2.id, courseId: course1.id },
    ];

    for (const e of enrollmentsData) {
      const exists = await this.enrollmentRepo.findOneBy({ studentId: e.studentId, courseId: e.courseId });
      if (!exists) {
        await this.enrollmentRepo.save(this.enrollmentRepo.create(e));
        this.logger.log(`  ✅ Enrollment: student ${e.studentId} → course ${e.courseId}`);
      } else {
        this.logger.log(`  ⏭️  Enrollment skipped (exists): student ${e.studentId} → course ${e.courseId}`);
      }
    }

    // ── Challenges ────────────────────────────────────────
    const challengesData = [
      {
        title: "Consulta SELECT básica",
        description: "Escribe una consulta SELECT que obtenga TODOS los registros y columnas de la tabla 'estudiantes'.",
        difficulty: ChallengeDifficulty.EASY,
        tags: ["SELECT", "básico"],
        databaseEngine: "postgresql",
        timeLimitMs: 30000,
        status: ChallengeStatus.PUBLISHED,
        courseId: course1.id,
        createdBy: professor.id,
        schemaSQL: `CREATE TABLE estudiantes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  fecha_nacimiento DATE NOT NULL
);`,
        seedSQL: `INSERT INTO estudiantes (nombre, email, fecha_nacimiento) VALUES
  ('Juan Pérez', 'juan@example.com', '2000-01-15'),
  ('María López', 'maria@example.com', '2001-03-20'),
  ('Carlos Ruiz', 'carlos@example.com', '1999-07-10'),
  ('Ana García', 'ana@example.com', '2002-11-05'),
  ('Pedro Sánchez', 'pedro@example.com', '2000-09-25');`,
      },
      {
        title: "Filtros con WHERE",
        description: "Obtén el nombre y email de los estudiantes nacidos DESPUÉS del 1 de enero del año 2000. Ordena el resultado por nombre alfabéticamente.",
        difficulty: ChallengeDifficulty.EASY,
        tags: ["SELECT", "WHERE", "filtros", "ORDER BY"],
        databaseEngine: "postgresql",
        timeLimitMs: 30000,
        status: ChallengeStatus.PUBLISHED,
        courseId: course1.id,
        createdBy: professor.id,
        schemaSQL: `CREATE TABLE estudiantes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  fecha_nacimiento DATE NOT NULL
);`,
        seedSQL: `INSERT INTO estudiantes (nombre, email, fecha_nacimiento) VALUES
  ('Juan Pérez', 'juan@example.com', '2000-01-15'),
  ('María López', 'maria@example.com', '2001-03-20'),
  ('Carlos Ruiz', 'carlos@example.com', '1999-07-10'),
  ('Ana García', 'ana@example.com', '2002-11-05'),
  ('Pedro Sánchez', 'pedro@example.com', '2000-09-25');`,
      },
      {
        title: "JOIN entre tablas",
        description: "Obtén el nombre del estudiante y el nombre del curso en el que está matriculado. Usa JOIN para combinar las tablas 'estudiantes', 'matriculas' y 'cursos'.",
        difficulty: ChallengeDifficulty.MEDIUM,
        tags: ["JOIN", "relaciones", "INNER JOIN"],
        databaseEngine: "postgresql",
        timeLimitMs: 60000,
        status: ChallengeStatus.PUBLISHED,
        courseId: course1.id,
        createdBy: professor.id,
        schemaSQL: `CREATE TABLE estudiantes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL
);

CREATE TABLE cursos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL
);

CREATE TABLE matriculas (
  estudiante_id INT NOT NULL REFERENCES estudiantes(id),
  curso_id INT NOT NULL REFERENCES cursos(id),
  PRIMARY KEY (estudiante_id, curso_id)
);`,
        seedSQL: `INSERT INTO estudiantes (nombre) VALUES
  ('Juan Pérez'), ('María López'), ('Carlos Ruiz'), ('Ana García');

INSERT INTO cursos (nombre) VALUES
  ('Matemáticas'), ('Historia'), ('Programación');

INSERT INTO matriculas (estudiante_id, curso_id) VALUES
  (1, 1), (1, 2),
  (2, 1), (2, 3),
  (3, 3),
  (4, 2), (4, 3);`,
      },
      {
        title: "Subconsultas con AVG",
        description: "Encuentra los estudiantes cuyo promedio de calificaciones sea SUPERIOR al promedio general de todos los estudiantes. Muestra el nombre del estudiante y su promedio.",
        difficulty: ChallengeDifficulty.HARD,
        tags: ["subconsultas", "AVG", "GROUP BY", "HAVING", "avanzado"],
        databaseEngine: "postgresql",
        timeLimitMs: 90000,
        status: ChallengeStatus.PUBLISHED,
        courseId: course2.id,
        createdBy: professor.id,
        schemaSQL: `CREATE TABLE estudiantes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL
);

CREATE TABLE calificaciones (
  id SERIAL PRIMARY KEY,
  estudiante_id INT NOT NULL REFERENCES estudiantes(id),
  materia VARCHAR(100) NOT NULL,
  nota NUMERIC(4,2) NOT NULL CHECK (nota >= 0 AND nota <= 20)
);`,
        seedSQL: `INSERT INTO estudiantes (nombre) VALUES
  ('Juan Pérez'), ('María López'), ('Carlos Ruiz'), ('Ana García'), ('Pedro Sánchez');

INSERT INTO calificaciones (estudiante_id, materia, nota) VALUES
  (1, 'Matemáticas', 15.5), (1, 'Historia', 12.0), (1, 'Programación', 16.0),
  (2, 'Matemáticas', 18.0), (2, 'Historia', 17.5), (2, 'Programación', 19.0),
  (3, 'Matemáticas', 10.0), (3, 'Historia', 11.0), (3, 'Programación', 9.5),
  (4, 'Matemáticas', 14.0), (4, 'Historia', 15.0), (4, 'Programación', 13.0),
  (5, 'Matemáticas', 8.0), (5, 'Historia', 7.5), (5, 'Programación', 9.0);`,
      },
    ];

    const existingChallenges = await this.challengeRepo.findAll();
    for (const c of challengesData) {
      const found = existingChallenges.find((e) => e.title === c.title && e.courseId === c.courseId);
      if (!found) {
        await this.challengeRepo.save(
          new Challenge(
            null, c.title, c.description, c.difficulty, c.tags,
            c.databaseEngine, c.timeLimitMs, c.status,
            c.courseId, c.createdBy, c.schemaSQL, c.seedSQL,
            new Date(), new Date(),
          ),
        );
        this.logger.log(`  ✅ Challenge created: "${c.title}" (${c.difficulty})`);
      } else {
        this.logger.log(`  ⏭️  Challenge skipped (exists): "${c.title}"`);
      }
    }

    this.logger.log("✅ Seed completed successfully!");
  }
}
