import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Res } from '@nestjs/common';
import { ClassroomService } from './classroom.service';

@Controller('classroom')
export class ClassroomController {
  constructor(
    private readonly classroomService: ClassroomService
  ) {}

  @Get('list')
  async getClassrooms(@Res() res, @Query() query) {
    try {
      let page = query.page ? (parseInt(query.page, 10) - 1) : 0; // for when page * limit is used in query
      let limit = query.limit ? parseInt(query.limit, 10) : 10;

      const classroomFilterData = {
        classroomId: query.classroomId,
        className: query.className,
        homeroomTeacher: query.homeroomTeacher,
      }

      const results = await this.classroomService.getClassrooms(page, limit, classroomFilterData);
      res.status(HttpStatus.OK).json({
        status: true,
        message: 'Classrooms list fetched successfully',
        data: results,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: 'Failed to fetch classrooms list',
        error: error.message,
      });
    }
  }

  @Get('detail/:classroomId')
  async getClassroom(@Res() res, @Query() query, @Param('classroomId') classroomId: string) {
    try {
      const results = await this.classroomService.getClassroom(classroomId);
      res.status(HttpStatus.OK).json({
        status: true,
        message: 'Classroom detail fetched successfully',
        data: results,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: 'Failed to fetch classroom detail',
        error: error.message,
      });
    }
  }

  @Get('students/:classroomId')
  async getClassroomStudents(@Res() res, @Query() query, @Param('classroomId') classroomId: string) {
    try {
      let page = query.page ? (parseInt(query.page, 10) - 1) : 0; // for when page * limit is used in query
      let limit = query.limit ? parseInt(query.limit, 10) : 10;

      const results = await this.classroomService.getClassroomStudents(classroomId, page, limit);
      res.status(HttpStatus.OK).json({
        status: true,
        message: 'Classroom students fetched successfully',
        data: results,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: 'Failed to fetch classroom students',
        error: error.message,
      });
    }
  }

  @Get('students-not-in-class')
  async getStudentsNotInClassRoom(@Res() res, @Query() query) {
    try {
      let page = query.page ? (parseInt(query.page, 10) - 1) : 0; // for when page * limit is used in query
      let limit = query.limit ? parseInt(query.limit, 10) : 10;

      const results = await this.classroomService.getStudentsNotInClassroom(page, limit);
      res.status(HttpStatus.OK).json({
        status: true,
        message: 'Classroom students count fetched successfully',
        data: results,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: 'Failed to fetch classroom students count',
        error: error.message,
      });
    }
  }

  @Put('update/:classroomId')
  async updateClassroom(@Res() res, @Param('classroomId') classroomId: string, @Body() body) {
    try {
      const classroomData = {
        classroomid: body.classroomId,
        classname: body.className,
        academicYear: body.academicYear, 
        homeroomTeacher: body.homeroomTeacher,
      }
      const results = await this.classroomService.updateClassroom(classroomId, classroomData);
      res.status(HttpStatus.OK).json({
        status: true,
        message: 'Classroom updated successfully',
        data: results,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: 'Failed to update classroom',
        error: error.message,
      });
    }
  }

  @Post('create')
  async createClassroom(@Res() res, @Body() body) {
    try {
      const classroomData = {
        className: body.className,
        academicYear: body.academicYear,
        homeroomTeacher: body.homeroomTeacher,
      }
      const results = await this.classroomService.createClassroom(classroomData);
  
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
  
  @Delete('delete/:classroomId')
  async deleteStudent(@Res() res, @Param('classroomId') classroomId: string){
    try {
      const results = await this.classroomService.deleteClassroom(classroomId);
  
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

  @Delete('remove-student/:studentId/:classroomId')
  async removeStudentFromClass(@Res() res, @Param('studentId') studentId: string, @Param('classroomId') classroomId: string) {
    try {
      const results = await this.classroomService.removeStudentFromClassroom(studentId, classroomId);
  
      res.status(HttpStatus.OK).json({
        status: true,
        message: 'Student removed from class successfully',
        data: results,
      })
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: 'Error while removing student from class',
        data: error.message,
      })
    }
  }

  @Post('add-student') 
  async addStudentToClass(@Res() res, @Body() body) {
    try {
      const results = await this.classroomService.addStudentToClassroom(body.studentId, body.classroomId);
  
      res.status(HttpStatus.OK).json({
        status: true,
        message: 'Student added to class successfully',
        data: results,
      })
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: 'Error while adding student to class',
        data: error.message,
      })
    }
  }

  @Get('get-male-student-raw-query')
  async getStudentRawQuery(@Res() res, @Query() query) {
    try {
      const results = await this.classroomService.getMaleStudentsRawQuery();
  
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
}
