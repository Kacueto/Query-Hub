import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { CreateChallengeUseCase } from "../../../application/use-cases/challenges/create-challenge.use-case";
import { GetAllChallengesUseCase } from "../../../application/use-cases/challenges/get-all-challenges.use-case";
import { GetChallengeByIdUseCase } from "../../../application/use-cases/challenges/get-challenge-by-id.use-case";
import { UpdateChallengeUseCase } from "../../../application/use-cases/challenges/update-challenge.use-case";
import { DeleteChallengeUseCase } from "../../../application/use-cases/challenges/delete-challenge.use-case";
import { PublishChallengeUseCase } from "../../../application/use-cases/challenges/publish-challenge.use-case";
import { UpdateChallengeSchemaUseCase } from "../../../application/use-cases/challenges/update-challenge-schema.use-case";
import { UpdateChallengeSeedUseCase } from "../../../application/use-cases/challenges/update-challenge-seed.use-case";
import { CreateChallengeDto } from "../../../application/dtos/create-challenge.dto";
import { UpdateChallengeDto } from "../../../application/dtos/update-challenge.dto";
import { UpdateSchemaDto } from "../../../application/dtos/update-schema.dto";
import { UpdateSeedDto } from "../../../application/dtos/update-seed.dto";
import { QueryChallengesDto } from "../../../application/dtos/query-challenges.dto";
import { Roles } from "../../decorators/roles.decorator";
import { RolesGuard } from "../../guards/roles.guard";
import { Role } from "../../../domain/enums/role.enum";

@Controller("challenges")
export class ChallengesController {
  constructor(
    private readonly createChallenge: CreateChallengeUseCase,
    private readonly getAllChallenges: GetAllChallengesUseCase,
    private readonly getChallengeById: GetChallengeByIdUseCase,
    private readonly updateChallenge: UpdateChallengeUseCase,
    private readonly deleteChallenge: DeleteChallengeUseCase,
    private readonly publishChallenge: PublishChallengeUseCase,
    private readonly updateChallengeSchema: UpdateChallengeSchemaUseCase,
    private readonly updateChallengeSeed: UpdateChallengeSeedUseCase,
  ) {}

  @Post()
  @Roles(Role.PROFESSOR)
  @UseGuards(RolesGuard)
  create(@Body() dto: CreateChallengeDto) {
    return this.createChallenge.execute(dto);
  }

  @Get()
  findAll(@Query() filters: QueryChallengesDto) {
    return this.getAllChallenges.execute(filters);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.getChallengeById.execute(id);
  }

  @Patch(":id")
  @Roles(Role.PROFESSOR)
  @UseGuards(RolesGuard)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateChallengeDto,
  ) {
    return this.updateChallenge.execute(id, dto);
  }

  @Delete(":id")
  @Roles(Role.PROFESSOR)
  @UseGuards(RolesGuard)
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.deleteChallenge.execute(id);
  }

  @Patch(":id/publish")
  @Roles(Role.PROFESSOR)
  @UseGuards(RolesGuard)
  publish(@Param("id", ParseIntPipe) id: number) {
    return this.publishChallenge.execute(id);
  }

  @Post(":id/schema")
  @Roles(Role.PROFESSOR)
  @UseGuards(RolesGuard)
  updateSchema(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateSchemaDto,
  ) {
    return this.updateChallengeSchema.execute(id, dto);
  }

  @Post(":id/seed")
  @Roles(Role.PROFESSOR)
  @UseGuards(RolesGuard)
  updateSeed(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateSeedDto,
  ) {
    return this.updateChallengeSeed.execute(id, dto);
  }
}
