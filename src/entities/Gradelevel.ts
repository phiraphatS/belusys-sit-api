import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Student } from "./Student";

@Entity("gradelevel", { schema: "quizdev_aa" })
export class Gradelevel {
  @PrimaryGeneratedColumn({ type: "int", name: "gradelevelid" })
  gradelevelid: number;

  @Column("varchar", { name: "levelname", length: 10 })
  levelname: string;

  @OneToMany(() => Student, (student) => student.gradelevel)
  students: Student[];
}
