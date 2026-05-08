import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';

@ApiTags("Submissions")
@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly service: SubmissionsService) {}

  @Post()
  @ApiOperation({ summary: "Enviar una solución SQL para evaluación" })
  @ApiResponse({ status: 201, description: "Submission encolada exitosamente" })
  create(@Body() dto: CreateSubmissionDto) {
    return this.service.createSubmission(dto);
  }
}