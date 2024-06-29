import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './endpoint/students/students.module';
import { ClassroomModule } from './endpoint/classroom/classroom.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    StudentsModule,
    ClassroomModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
