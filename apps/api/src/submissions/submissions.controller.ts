import { Body, Controller, Post } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly service: SubmissionsService) {}

  @Post()
  create(@Body() dto: CreateSubmissionDto) {
    return this.service.createSubmission(dto);
  }
}