import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { StudentClassroom } from "./StudentClassroom";

@Index("idx_classroom_id", ["classroomid"], {})
@Entity("classroom", { schema: "quizdev_aa" })
export class Classroom {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "classroomid",
    comment: "เลขห้อง",
  })
  classroomid: number;

  @Column("varchar", { name: "classname", comment: "ชื่อห้อง", length: 50 })
  classname: string;

  @Column("year", { name: "academic_year", comment: "ปีการศึกษา" })
  academicYear: number;

  @Column("varchar", {
    name: "homeroom_teacher",
    comment: "ชื่อครูประจำชั้น",
    length: 100,
  })
  homeroomTeacher: string;

  @OneToMany(
    () => StudentClassroom,
    (studentClassroom) => studentClassroom.classroom
  )
  studentClassrooms: StudentClassroom[];
}
