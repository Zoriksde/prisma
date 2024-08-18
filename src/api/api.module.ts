import { Module } from '@nestjs/common';
import { BlogController } from './controllers/blog/blog.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogRepositoryToken } from '../application/common/interfaces/blog/IBlogRepository';
import { PostgresBlogRepository } from '../infrastructure/database/repositories/blog/blog.repository';
import { BlogService } from '../application/services/blog/blog.service';
import { Blog } from '../infrastructure/database/configuration/Blog';
import { Post } from '../infrastructure/database/configuration/Post';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env.local', isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Blog, Post]),
  ],
  providers: [
    { provide: BlogRepositoryToken, useClass: PostgresBlogRepository },
    BlogService,
  ],
  controllers: [BlogController],
})
export class ApiModule {}
