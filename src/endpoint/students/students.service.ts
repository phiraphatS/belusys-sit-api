import { Injectable, Logger, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Student } from '../../entities/Student';
import dayjs = require('dayjs');

interface StudentFilterInterface {
    gradeLevel: string | undefined;
    studentId: string | undefined;
    // firstname: string | undefined;
    // lastname: string | undefined;
    fullname: string | undefined;
}

@Injectable()
export class StudentsService {
    private readonly logger = new Logger(StudentsService.name);
    constructor(
        private readonly dataSource: DataSource,
        @InjectRepository(Student)
        private studentRepository: Repository<Student>,
    ) { }

    async getStudents(page: number, limit: number, fileterData: StudentFilterInterface) {
        try {
            const { gradeLevel, studentId, fullname } = fileterData;

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
                .where('student.studentid IS NOT NULL'); // Just solving next condition with AND

            if (gradeLevel) {
                studentBuilder.andWhere(`gradelevel.levelname LIKE :gradeLevel`, { gradeLevel: `%${gradeLevel}%` });
            }

            if (studentId) {
                studentBuilder.andWhere('student.studentid = :studentId', { studentId });
            }

            if (fullname) {
                studentBuilder.andWhere(`CONCAT(prefix.prefixname, " ", student.firstname, " ", student.lastname) LIKE :fullname`, { fullname: `%${fullname}%` });
            }

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

    async getStudent(studentId: string) {
        try {
            const student = await this.studentRepository.createQueryBuilder('student')
                .select([
                    'student.studentid as `studentId`',
                    'student.firstname as `firstName`',
                    'student.lastname as `lastName`',
                    'student.birthdate as `birthDate`',
                    'prefix.prefixid as `prefixId`',
                    'gradelevel.gradelevelid as `gradeLevelId`',
                    'gender.genderid as `genderId`',
                ])
                .leftJoin('student.prefix', 'prefix')
                .leftJoin('student.gender', 'gender')
                .leftJoin('student.gradelevel', 'gradelevel')
                .where('student.studentid = :studentId', { studentId })
                .getRawOne();

            return student;
        } catch (error) {
            this.logger.error(error.message);
            throw error;
        }
    }

    async updateStudent(studentId: string, studentData: any) {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager
                .createQueryBuilder()
                .update(Student)
                .set(studentData)
                .where('studentid = :studentId', { studentId })
                .execute();
            await queryRunner.commitTransaction();
            return `Student with ID ${studentId} updated successfully`
        } catch (error) {
            queryRunner.rollbackTransaction();
            this.logger.error(error.message);
            throw error;
        } finally {
            queryRunner.release();
        }
    }

    async createStudent(studentData: any) {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const student = this.studentRepository.create();
            student.firstname = studentData.firstname;
            student.lastname = studentData.lastname;
            student.birthdate = dayjs(studentData.birthdate).format('YYYY-MM-DD');
            student.prefixid = studentData.prefixid;
            student.gradelevelid = studentData.gradelevelid;
            student.genderid = studentData.genderid;

            await queryRunner.manager.save(student);
            await queryRunner.commitTransaction();
            return `Student with ID ${student.studentid} created successfully`
        } catch (error) {
            queryRunner.rollbackTransaction();
            this.logger.error(error.message);
            throw error;
        } finally {
            queryRunner.release();
        }
    }

    async deleteStudent(studentId: string) {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager
                .createQueryBuilder()
                .delete()
                .from(Student)
                .where('studentid = :studentId', { studentId })
                .execute();
            await queryRunner.commitTransaction();
            return `Student with ID ${studentId} deleted successfully`
        } catch (error) {
            queryRunner.rollbackTransaction();
            this.logger.error(error.message);
            throw error;
        } finally {
            queryRunner.release();
        }
    }

}
