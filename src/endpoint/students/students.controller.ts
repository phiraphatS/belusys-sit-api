import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Put, Query, Res } from '@nestjs/common';
import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {
  constructor(
    private readonly studentsService: StudentsService
  ) {}

  @Get('list')
  async getStudents(@Res() res, @Query() query) {
    try {
      let page = query.page ? (parseInt(query.page, 10) - 1) : 0; // for when page * limit is used in query
      let limit = query.limit ? parseInt(query.limit, 10) : 10;

      const studentFilterData = {
        gradeLevel: query.gradeLevel,
        studentId: query.studentId,
        fullname: query.fullname,
      }
      const results = await this.studentsService.getStudents(page, limit, studentFilterData);
  
      res.status(HttpStatus.OK).json({
        status: true,
        message: 'Students list',
        data: results,
      })
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: 'Error while fetching students list',
        data: error.message,
      })
    }
  }

  @Get('detail/:studentId')
  async getStudent(@Res() res, @Param('studentId') studentId: string){
    try {
      const results = await this.studentsService.getStudent(studentId);
  
      res.status(HttpStatus.OK).json({
        status: true,
        message: 'Student detail',
        data: results,
      })
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: 'Error while fetching student detail',
        data: error.message,
      })
    }
  }

  @Put('update/:studentId')
  async updateStudent(@Res() res, @Param('studentId') studentId: string, @Body() body){
    try {
      const studentData = {
        studentid: body.studentId,
        firstname: body.firstName,
        lastname: body.lastName,
        birthdate: body.birthDate,
        prefixid: body.prefixId,
        gradelevelid: body.gradeLevelId,
        genderid: body.genderId,
      }
      const results = await this.studentsService.updateStudent(studentId, studentData);
  
      res.status(HttpStatus.OK).json({
        status: true,
        message: 'Student updated successfully',
        data: results,
      })
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: 'Error while updating student',
        data: error.message,
      })
    }
  }

  @Post('create')
  async createStudent(@Res() res, @Body() body){
    try {
      const studentData = {
        firstname: body.firstName,
        lastname: body.lastName,
        birthdate: body.birthDate,
        prefixid: body.prefixId,
        gradelevelid: body.gradeLevelId,
        genderid: body.genderId,
      }
      const results = await this.studentsService.createStudent(studentData);
  
      res.status(HttpStatus.OK).json({
        status: true,
        message: 'Student created successfully',
        data: results,
      })
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: 'Error while creating student',
        data: error.message,
      })
    }
  }

  @Delete('delete/:studentId')
  async deleteStudent(@Res() res, @Param('studentId') studentId: string){
    try {
      const results = await this.studentsService.deleteStudent(studentId);
  
      res.status(HttpStatus.OK).json({
        status: true,
        message: 'Student deleted successfully',
        data: results,
      })
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: 'Error while deleting student',
        data: error.message,
      })
    }
  }
}
