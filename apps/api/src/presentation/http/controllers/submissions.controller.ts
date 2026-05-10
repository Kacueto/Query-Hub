import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateSubmissionUseCase } from '../../../application/use-cases/submissions/create-submission.use-case';
import { CreateSubmissionDto } from '../../../application/dtos/create-submission.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../../domain/enums/role.enum';

@ApiBearerAuth()
@ApiTags("Submissions")
@Controller('submissions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubmissionsController {
  constructor(private readonly createSubmission: CreateSubmissionUseCase) {}

  @Post()
  @Roles(Role.STUDENT, Role.PROFESSOR)
  @ApiOperation({ summary: "Enviar una solución SQL para evaluación" })
  @ApiResponse({ status: 201, description: "Submission encolada exitosamente" })
  @ApiResponse({ status: 400, description: "Datos de entrada inválidos" })
  @ApiResponse({ status: 401, description: "Token inválido o no proporcionado" })
  @ApiResponse({ status: 403, description: "No tiene permisos para realizar esta acción" })
  create(@Request() req, @Body() dto: CreateSubmissionDto) {
    return this.createSubmission.execute(req.user.id, dto.challengeId, dto.sql);
  }
}
