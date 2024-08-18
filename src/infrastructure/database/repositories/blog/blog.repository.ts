import { Repository } from 'typeorm';
import { IBlogRepository } from '../../../../application/common/interfaces/blog/IBlogRepository';
import { Blog as PostgresBlogEntity } from '../../entities/Blog';
import { Post as PostgresPostEntity } from '../../entities/Post';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Blog } from '../../../../domain/aggregates/blog//Blog';
import { Post } from '../../../../domain/aggregates/blog/entities/Post';

@Injectable()
export class PostgresBlogRepository implements IBlogRepository {
  constructor(
    @InjectRepository(PostgresBlogEntity)
    private readonly blogEntityRepository: Repository<PostgresBlogEntity>,
  ) {}

  private mapToEntity(blog: Blog): PostgresBlogEntity {
    const blogEntity = new PostgresBlogEntity();

    blogEntity.id = blog.getId();
    blogEntity.name = blog.getName();
    blogEntity.slug = blog.getSlug();

    blogEntity.posts = (blog.getPosts() || []).map((post) => {
      const postEntity = new PostgresPostEntity();

      postEntity.id = post.getId();
      postEntity.title = post.getTitle();
      postEntity.content = post.getContent();
      postEntity.viewCount = post.getViewCount();

      return postEntity;
    });

    return blogEntity;
  }

  private mapToDomain(blogEntity: PostgresBlogEntity): Blog {
    const posts = (blogEntity.posts || []).map((postEntity) => {
      return Post.createPost(
        postEntity.id,
        postEntity.content,
        postEntity.viewCount,
        postEntity.title,
      );
    });

    return Blog.createBlog(
      blogEntity.id,
      blogEntity.name,
      blogEntity.slug,
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
