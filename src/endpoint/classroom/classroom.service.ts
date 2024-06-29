import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Classroom } from '../../entities/Classroom';
import { StudentClassroom } from '../../entities/StudentClassroom';
import { Student } from '../../entities/Student';

interface ClassroomFilterInterface {
    classroomId: string | undefined;
    className: string | undefined;
    homeroomTeacher: string | undefined;
}

@Injectable()
export class ClassroomService {
    private readonly logger = new Logger(ClassroomService.name);
    constructor(
        private readonly dataSource: DataSource,
        @InjectRepository(Classroom)
        private readonly classroomRepository: Repository<Classroom>,
        @InjectRepository(StudentClassroom)
        private readonly studentClassroomRepository: Repository<StudentClassroom>,
        @InjectRepository(Student)
        private readonly studentRepository: Repository<Student>,
    ) { }

    async getClassrooms(page: number, limit: number, fileterData: ClassroomFilterInterface) {
        try {
            const { classroomId, className, homeroomTeacher } = fileterData;

            const classroomBuilder = this.classroomRepository.createQueryBuilder('classroom')
                .select([
                    'classroom.classroomid as `key`',
                    'classroom.classname as `classname`',
                    'classroom.academic_year as `academicYear`',
                    'classroom.homeroom_teacher as `homeroomTeacher`',
                ])
                .where('classroom.classroomid IS NOT NULL'); // Just solving next condition with AND

            if (classroomId) {
                classroomBuilder.andWhere('classroom.classroomid = :classroomId', { classroomId });
            }

            if (className) {
                classroomBuilder.andWhere('classroom.classname LIKE :className', { className: `%${className}%` });
            }

            if (homeroomTeacher) {
                classroomBuilder.andWhere('classroom.homeroom_teacher LIKE :homeroomTeacher', { homeroomTeacher: `%${homeroomTeacher}%` });
            }

            const countClassrooms = await classroomBuilder.getCount();

            const classrooms = await classroomBuilder
                .offset(page * limit)
                .limit(limit)
                .getRawMany();

            return { list: classrooms, total: countClassrooms};
        } catch (error) {
            this.logger.error(error.message);
            throw error;
        }
    }

    async getClassroom(classroomId: string) {
        try {
            const classroom = await this.classroomRepository.createQueryBuilder('classroom')
                .select([
                    'classroom.classroomid as `classroomId`',
                    'classroom.classname as `className`',
                    'classroom.academic_year as `academicYear`',
                    'classroom.homeroom_teacher as `homeroomTeacher`',
                ])
                .where('classroom.classroomid = :classroomId', { classroomId })
                .getRawOne();

            return classroom;
        } catch (error) {
            this.logger.error(error.message);
            throw error;
        }
    }

    async updateClassroom(classroomId: string, classroomData: any) {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager
                .createQueryBuilder()
                .update(Classroom)
                .set(classroomData)
                .where('classroomid = :classroomId', { classroomId })
                .execute();
            await queryRunner.commitTransaction();
            return `Student with ID ${classroomId} updated successfully`
        } catch (error) {
            queryRunner.rollbackTransaction();
            this.logger.error(error.message);
            throw error;
        } finally {
            queryRunner.release();
        }
    }

    async createClassroom(classroomData: any) {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const classroom = this.classroomRepository.create();
            classroom.classname = classroomData.className;
            classroom.academicYear = classroomData.academicYear;
            classroom.homeroomTeacher = classroomData.homeroomTeacher;

            await queryRunner.manager.save(classroom);
            await queryRunner.commitTransaction();
            return `Classroom with ID ${classroom.classroomid} created successfully`
        } catch (error) {
            queryRunner.rollbackTransaction();
            this.logger.error(error.message);
            throw error;
        } finally {
            queryRunner.release();
        }
    }

    async deleteClassroom(classroomId: string) {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager
                .createQueryBuilder()
                .delete()
                .from(Classroom)
                .where('classroomid = :classroomId', { classroomId })
                .execute();
            await queryRunner.commitTransaction();
            return `Classroom with ID ${classroomId} deleted successfully`
        } catch (error) {
            queryRunner.rollbackTransaction();
            this.logger.error(error.message);
            throw error;
        } finally {
            queryRunner.release();
        }
    }
    
    async getClassroomStudents(classroomId: string, page: number, limit: number) {
        try {
            const studentClassroomBuilder = this.studentClassroomRepository.createQueryBuilder('student_classroom')
                .select([
                    'student_classroom.studentid as `studentId`',
                    'student_classroom.classroomid as `classroomId`',
                    'student.studentid as `key`',
                    'student.firstname as `firstName`',
                    'student.lastname as `lastName`',
                    'student.birthdate as `birthdate`',
                    'prefix.prefixname as `prefixName`',
                    'gradelevel.levelname as `levelName`',
                    'gender.gendername as `genderName`',
                    'CONCAT(prefix.prefixname, " ", student.firstname, " ", student.lastname) AS `fullname`',
                ])
                .leftJoin('student_classroom.student', 'student')
                .leftJoin('student.prefix', 'prefix')
                .leftJoin('student.gender', 'gender')
                .leftJoin('student.gradelevel', 'gradelevel')
                .where('student_classroom.classroomid = :classroomId', { classroomId });

            const countstudentClassrooms = await studentClassroomBuilder.getCount();
            const studentClassroom = await studentClassroomBuilder
                .offset(page * limit)
                .limit(limit)
                .getRawMany();

            return { list: studentClassroom, total: countstudentClassrooms };
        } catch (error) {
            this.logger.error(error.message);
            throw error;
        }
    }

    async getStudentsNotInClassroom(page: number, limit: number) {
        try {
            const studentBuilder = this.studentRepository.createQueryBuilder('student')
                .select([
                    'student.studentid as `key`',
                    'student.firstname as `firstName`',
                    'student.lastname as `lastName`',
                    'student.birthdate as `birthdate`',
                    'prefix.prefixname as `prefixName`',
                    'gradelevel.levelname as `levelName`',
                    'gender.gendername as `genderName`',
                    'CONCAT(prefix.prefixname, " ", student.firstname, " ", student.lastname) AS `fullname`',
                ])
                .leftJoin('student.prefix', 'prefix')
                .leftJoin('student.gender', 'gender')
                .leftJoin('student.gradelevel', 'gradelevel')
                .leftJoin('student.studentClassrooms', 'student_classroom')
                .where('student_classroom.studentid IS NULL');

            const countStudents = await studentBuilder.getCount();
            const students = await studentBuilder
                .offset(page * limit)
                .limit(limit)
                .getRawMany();

            return { list: students, total: countStudents };
        } catch (error) {
            this.logger.error(error.message);
            throw error;
        }
    }

    async removeStudentFromClassroom(studentId: string, classroomId: string) {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager
                .createQueryBuilder()
                .delete()
                .from(StudentClassroom)
                .where('studentid = :studentId AND classroomid = :classroomId', { studentId, classroomId })
                .execute();
            await queryRunner.commitTransaction();
            return `Student with ID ${studentId} removed from classroom with ID ${classroomId} successfully`
        } catch (error) {
            queryRunner.rollbackTransaction();
            this.logger.error(error.message);
            throw error;
        } finally {
            queryRunner.release();
        }
    }

    async addStudentToClassroom(studentId: string, classroomId: string) {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const studentClassroom = this.studentClassroomRepository.create();
            studentClassroom.studentid = parseInt(studentId, 10);
            studentClassroom.classroomid = parseInt(classroomId, 10);

            await queryRunner.manager.save(studentClassroom);
            await queryRunner.commitTransaction();
            return `Student with ID ${studentId} added to classroom with ID ${classroomId} successfully`
        } catch (error) {
            queryRunner.rollbackTransaction();
            this.logger.error(error.message);
            throw error;
        } finally {
            queryRunner.release();
        }
    }

    // #region Raw Query 3.1
    async getMaleStudentsRawQuery() {
        try {
            const sql = `
                SELECT 
                    std.firstname,
                    std.lastname,
                    std.birthdate,
                    TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) AS age,
                    gen.gendername,
                    pre.prefixname,
                    grad.levelname,
                    cls.classname,
                    cls.homeroom_teacher
                FROM quizdev_aa.student std
                LEFT JOIN quizdev_aa.prefix pre ON pre.prefixid = std.prefixid
                LEFT JOIN quizdev_aa.gender gen ON gen.genderid = std.genderid
                LEFT JOIN quizdev_aa.gradelevel grad ON grad.gradelevelid = std.gradelevelid
                LEFT JOIN quizdev_aa.student_classroom stc ON stc.studentid = std.studentid
                LEFT JOIN quizdev_aa.classroom cls ON cls.classroomid = stc.classroomid
                WHERE gen.genderid = 1 AND TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) BETWEEN 10 AND 12`

            const students = await this.dataSource.query(sql);
            return students;
        } catch (error) {
            this.logger.error(error.message);
            throw error;
        }
    }
    //#endregion
}
