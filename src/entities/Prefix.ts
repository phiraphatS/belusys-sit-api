import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Student } from "./Student";

@Entity("prefix", { schema: "quizdev_aa" })
export class Prefix {
  @PrimaryGeneratedColumn({ type: "int", name: "prefixid" })
  prefixid: number;

  @Column("varchar", { name: "prefixname", length: 10 })
  prefixname: string;

  @OneToMany(() => Student, (student) => student.prefix)
  students: Student[];
}
