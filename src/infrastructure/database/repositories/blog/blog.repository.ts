import { Repository } from 'typeorm';
import { IBlogRepository } from '../../../../application/common/interfaces/blog/IBlogRepository';
import { Blog as InfrastructureBlogConfiguration } from '../../configuration/Blog';
import { Post as InfrastructurePostConfiguration } from '../../configuration/Post';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Blog } from '../../../../domain/aggregates/blog//Blog';
import { Post } from '../../../../domain/aggregates/blog/entities/Post';

@Injectable()
export class PostgresBlogRepository implements IBlogRepository {
  constructor(
    @InjectRepository(InfrastructureBlogConfiguration)
    private readonly blogEntityRepository: Repository<InfrastructureBlogConfiguration>,
  ) {}

  private mapToEntity(blog: Blog): InfrastructureBlogConfiguration {
    const blogEntity = new InfrastructureBlogConfiguration();

    blogEntity.id = blog.getId();
    blogEntity.name = blog.getName();
    blogEntity.slug = blog.getSlug();

    blogEntity.posts = (blog.getPosts() || []).map((post) => {
      const postEntity = new InfrastructurePostConfiguration();

      postEntity.id = post.getId();
      postEntity.title = post.getTitle();
      postEntity.content = post.getContent();
      postEntity.viewCount = post.getViewCount();

      return postEntity;
    });

    return blogEntity;
  }

  private mapToDomain(
    blogConfiguration: InfrastructureBlogConfiguration,
  ): Blog {
    const posts = (blogConfiguration.posts || []).map((postConfiguration) => {
      return Post.createPost(
        postConfiguration.id,
        postConfiguration.content,
        postConfiguration.viewCount,
        postConfiguration.title,
      );
    });

    return Blog.createBlog(
      blogConfiguration.id,
      blogConfiguration.name,
      blogConfiguration.slug,
      posts,
    );
  }

  async createBlog(blog: Blog): Promise<Blog> {
    const blogEntity = this.mapToEntity(blog);
    const blogResult = await this.blogEntityRepository.save(blogEntity);
    return blogResult ? this.mapToDomain(blogResult) : null;
  }

  async getBlog(id: string, shouldReturnPosts: boolean): Promise<Blog> {
    const blogEntity = await this.blogEntityRepository.findOne({
      relations: { posts: shouldReturnPosts },
      where: {
        id,
      },
    });

    return blogEntity ? this.mapToDomain(blogEntity) : null;
  }

  async updateBlog(blog: Blog): Promise<Blog> {
    const blogEntity = this.mapToEntity(blog);
    const blogResult = await this.blogEntityRepository.save(blogEntity);
    return blogResult ? this.mapToDomain(blogResult) : null;
  }
}
