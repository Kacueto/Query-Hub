import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ChallengeTypeormEntity } from "./challenge.typeorm-entity";

@Entity("schemas")
export class SchemaTypeormEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "challenge_id" })
  challengeId: number;

  @ManyToOne(() => ChallengeTypeormEntity, (challenge) => challenge.schemas)
  @JoinColumn({ name: "challenge_id" })
  challenge: ChallengeTypeormEntity;

  @Column({ type: "varchar" })
  nombre: string;

  @Column({ type: "text", name: "ddl_sql" })
  ddlSql: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
