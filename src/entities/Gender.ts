import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Student } from "./Student";

@Entity("gender", { schema: "quizdev_aa" })
export class Gender {
  @PrimaryGeneratedColumn({ type: "int", name: "genderid" })
  genderid: number;

  @Column("varchar", { name: "gendername", length: 10 })
  gendername: string;

  @OneToMany(() => Student, (student) => student.gender)
  students: Student[];
}
