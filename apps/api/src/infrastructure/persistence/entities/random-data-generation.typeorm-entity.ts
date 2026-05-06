import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { ChallengeTypeormEntity } from "./challenge.typeorm-entity";

@Entity("random_data_generations")
export class RandomDataGenerationTypeormEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "challenge_id" })
  challengeId: number;

  @OneToOne(
    () => ChallengeTypeormEntity,
    (challenge) => challenge.randomDataGeneration,
  )
  @JoinColumn({ name: "challenge_id" })
  challenge: ChallengeTypeormEntity;

  @Column({ type: "json", name: "registros_por_tabla" })
  registrosPorTabla: object;

  @Column({ type: "json", name: "rango_fechas" })
  rangoFechas: object;

  @Column({ type: "numeric", name: "min_numeric" })
  minNumeric: number;

  @Column({ type: "numeric", name: "max_numeric" })
  maxNumeric: number;

  @Column({ type: "json", name: "text_value_lists" })
  textValueLists: object;

  @Column({ type: "numeric", name: "null_percentage" })
  nullPercentage: number;

  @Column({ type: "json", name: "edge_cases" })
  edgeCases: object;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
