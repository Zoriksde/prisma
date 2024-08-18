import { Module } from '@nestjs/common';
import { BlogController } from './controllers/blog/blog.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogRepositoryToken } from '../application/common/interfaces/blog/IBlogRepository';
import { PostgresBlogRepository } from '../infrastructure/database/repositories/blog/blog.repository';
import { BlogService } from '../application/services/blog/blog.service';
import { Blog } from '../infrastructure/database/entities/Blog';
import { Post } from '../infrastructure/database/entities/Post';

/**
 * It provides Dependency Injection container for the whole application. Ideally, it could be divided into
 * specific areas of application (e.g Infrastructure, API, etc.), however due to NestJs limitations of providing
 * dependeny injection and specific import requirements, I'd let it stay here for the sake of simplicity.
 *
 * NOTE: Ideally, application should be divided into stages (e.g local, QA, production, etc.), and the configuration
 * options should differ, some of the secrets may be provided by external secrets manager services (e.g AWS Secrets Manager),
 * for the sake of simplicity, I'm storing it only in environmental variables, only for one specific environment - local.
 */
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
  /**
   * This allows us for injecting speicfic repository to the application layer. It makes switching the database a lot simpler,
   * as application layer is not aware of the configuration of repository, it's not even aware of the database etc. As long as
   * the repository fulfills the interface requirements, it's good to be used in the application layer. The repository
   * implementation is in infrastructure layer, which is the only place where the database is configured.
   */
  providers: [
    { provide: BlogRepositoryToken, useClass: PostgresBlogRepository },
    BlogService,
  ],
  controllers: [BlogController],
})
export class ApiModule {}
