import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Student } from '../../entities/Student';
import { Classroom } from '../../entities/Classroom';
import { Gender } from '../../entities/Gender';
import { Gradelevel } from '../../entities/Gradelevel';
import { Prefix } from '../../entities/Prefix';
import { StudentClassroom } from '../../entities/StudentClassroom';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
            // Handle the entities path based on the environment
            let entitiesPath = 'entities/*.entity{.ts,.js}';
            if (configService.get('environment') === 'development') {
                entitiesPath = 'dist/**/*.entity.js';
            }

            const config: TypeOrmModuleOptions = {
                type: 'mysql',
                host: configService.get('database.host'),
                port: configService.get('database.port'),
                username: configService.get('database.username'),
                password: configService.get('database.password'),
                database: configService.get('database.name'),entities: [
                    Student,
                    Classroom,
                    Gender,
                    Gradelevel,
                    Prefix,
                    StudentClassroom,
                ],
                synchronize: false,
                retryAttempts: 1,
            };

            return config;
        },
    })
  ],
})
export class DatabaseModule {}