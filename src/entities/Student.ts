import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Prefix } from "./Prefix";
import { Gender } from "./Gender";
import { Gradelevel } from "./Gradelevel";
import { StudentClassroom } from "./StudentClassroom";

@Index("genderid", ["genderid"], {})
@Index("gradelevelid", ["gradelevelid"], {})
@Index("idx_student_id", ["studentid"], {})
@Index("prefixid", ["prefixid"], {})
@Entity("student", { schema: "quizdev_aa" })
export class Student {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "studentid",
    comment: "เลขประจำตัวนักเรียน",
  })
  studentid: number;

  @Column("int", { name: "prefixid", nullable: true, comment: "คำนำหน้าชื่อ" })
  prefixid: number | null;

  @Column("varchar", { name: "firstname", comment: "ชื่อนักเรียน", length: 50 })
  firstname: string;

  @Column("varchar", {
    name: "lastname",
    comment: "นามสกุลนักเรียน",
    length: 50,
  })
  lastname: string;

  @Column("int", { name: "genderid", nullable: true, comment: "เพศ" })
  genderid: number | null;

  @Column("date", { name: "birthdate", comment: "วันเกิดนักเรียน" })
  birthdate: string;

  @Column("int", {
    name: "gradelevelid",
    nullable: true,
    comment: "ระดับชั้นนักเรียน",
  })
  gradelevelid: number | null;

  @ManyToOne(() => Prefix, (prefix) => prefix.students, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "prefixid", referencedColumnName: "prefixid" }])
  prefix: Prefix;

  @ManyToOne(() => Gender, (gender) => gender.students, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "genderid", referencedColumnName: "genderid" }])
  gender: Gender;

  @ManyToOne(() => Gradelevel, (gradelevel) => gradelevel.students, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "gradelevelid", referencedColumnName: "gradelevelid" }])
  gradelevel: Gradelevel;

  @OneToMany(
    () => StudentClassroom,
    (studentClassroom) => studentClassroom.student
  )
  studentClassrooms: StudentClassroom[];
}
