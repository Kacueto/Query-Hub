import { Body, Controller, Get, Post, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { JwtAuthGuard } from '../infrastructure/auth/jwt-auth.guard';

@ApiTags("Submissions")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly service: SubmissionsService) {}

  @Post()
  @ApiOperation({ summary: "Enviar una solución SQL para evaluación" })
  @ApiResponse({ status: 201, description: "Submission encolada exitosamente" })
  create(@Body() dto: CreateSubmissionDto) {
    return this.service.createSubmission(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: "Consultar estado y resultado de una submission" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "Submission encontrada" })
  @ApiResponse({ status: 404, description: "Submission no encontrada" })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.getSubmission(id);
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: "Listar todas las submissions de un estudiante" })
  @ApiParam({ name: "studentId", type: Number })
  @ApiResponse({ status: 200, description: "Lista de submissions" })
  findByStudent(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.service.getSubmissionsByStudent(studentId);
  }

  @Get('challenge/:challengeId')
  @ApiOperation({ summary: "Listar todas las submissions de un reto" })
  @ApiParam({ name: "challengeId", type: Number })
  @ApiResponse({ status: 200, description: "Lista de submissions" })
  findByChallenge(@Param('challengeId', ParseIntPipe) challengeId: number) {
    return this.service.getSubmissionsByChallenge(challengeId);
  }
}