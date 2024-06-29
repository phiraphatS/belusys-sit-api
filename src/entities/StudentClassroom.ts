import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Student } from "./Student";
import { Classroom } from "./Classroom";

@Index("classroomid", ["classroomid"], {})
@Index("idx_student_classroom_id", ["studentClassroomId"], {})
@Index("studentid", ["studentid"], {})
@Entity("student_classroom", { schema: "quizdev_aa" })
export class StudentClassroom {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "student_classroom_id",
    comment: "รหัสนักเรียนในห้อง",
  })
  studentClassroomId: number;

  @Column("int", { name: "studentid", comment: "รหัสนักเรียน" })
  studentid: number;

  @Column("int", { name: "classroomid", comment: "รหัสห้องเรียน" })
  classroomid: number;

  @ManyToOne(() => Student, (student) => student.studentClassrooms, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "studentid", referencedColumnName: "studentid" }])
  student: Student;

  @ManyToOne(() => Classroom, (classroom) => classroom.studentClassrooms, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "classroomid", referencedColumnName: "classroomid" }])
  classroom: Classroom;
}
