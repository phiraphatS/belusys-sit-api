import { Module } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { ClassroomController } from './classroom.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Classroom } from '../../entities/Classroom';
import { StudentClassroom } from '../../entities/StudentClassroom';
import { Student } from '../../entities/Student';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Student,
      Classroom,
      StudentClassroom,
    ]),
  ],
  controllers: [ClassroomController],
  providers: [ClassroomService],
})
export class ClassroomModule {}
