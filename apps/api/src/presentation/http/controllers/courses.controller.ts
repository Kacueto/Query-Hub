import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Request,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { CreateCourseUseCase } from "../../../application/use-cases/courses/create-course.use-case";
import { GetAllCoursesUseCase } from "../../../application/use-cases/courses/get-all-courses.use-case";
import { GetCourseByIdUseCase } from "../../../application/use-cases/courses/get-course-by-id.use-case";
import { UpdateCourseUseCase } from "../../../application/use-cases/courses/update-course.use-case";
import { DeleteCourseUseCase } from "../../../application/use-cases/courses/delete-course.use-case";
import { CreateCourseDto } from "../../../application/dtos/create-course.dto";
import { UpdateCourseDto } from "../../../application/dtos/update-course.dto";
import { Roles } from "../../decorators/roles.decorator";
import { JwtAuthGuard } from "../../guards/jwt-auth.guard";
import { RolesGuard } from "../../guards/roles.guard";
import { Role } from "../../../domain/enums/role.enum";

@ApiTags("Courses")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("courses")
export class CoursesController {
  constructor(
    private readonly createCourse: CreateCourseUseCase,
    private readonly getAllCourses: GetAllCoursesUseCase,
    private readonly getCourseById: GetCourseByIdUseCase,
    private readonly updateCourse: UpdateCourseUseCase,
    private readonly deleteCourse: DeleteCourseUseCase,
  ) {}

  @Post()
  @Roles(Role.PROFESSOR)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Crear un nuevo curso (solo PROFESSOR)" })
  @ApiResponse({ status: 201, description: "Curso creado exitosamente" })
  create(@Body() dto: CreateCourseDto) {
    return this.createCourse.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: "Listar cursos. STUDENT ve solo los suyos; PROFESSOR/ADMIN ve todos" })
  @ApiResponse({ status: 200, description: "Lista de cursos" })
  findAll(@Request() req) {
    const user = req.user;
    if (user.role === Role.STUDENT) {
      return this.getAllCourses.execute({ studentId: user.id });
    }
    return this.getAllCourses.execute();
  }

  @Get(":id")
  @Roles(Role.PROFESSOR, Role.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Obtener un curso por ID (solo PROFESSOR o ADMIN)" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "Curso encontrado" })
  @ApiResponse({ status: 403, description: "Acceso denegado" })
  @ApiResponse({ status: 404, description: "Curso no encontrado" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.getCourseById.execute(id);
  }

  @Patch(":id")
  @Roles(Role.PROFESSOR)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Actualizar un curso (solo PROFESSOR)" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "Curso actualizado" })
  @ApiResponse({ status: 404, description: "Curso no encontrado" })
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateCourseDto) {
    return this.updateCourse.execute(id, dto);
  }

  @Delete(":id")
  @Roles(Role.PROFESSOR)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Eliminar un curso (solo PROFESSOR)" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "Curso eliminado" })
  @ApiResponse({ status: 404, description: "Curso no encontrado" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.deleteCourse.execute(id);
  }
}
