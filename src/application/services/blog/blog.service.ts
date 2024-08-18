import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IBlogRepository } from '../../common/interfaces/blog/IBlogRepository';
import { InjectBlogRepository } from '../../common/interfaces/blog/IBlogRepository';
import { Blog } from '../../../domain/aggregates/blog/Blog';
import { CreateBlogData } from '../../../application/common/contracts/createBlogData';
import { Post } from '../../../domain/aggregates/blog/entities/Post';
import { CreatePostData } from '../../../application/common/contracts/createPostData';

@Injectable()
export class BlogService {
  constructor(
    @InjectBlogRepository() private readonly blogRepository: IBlogRepository,
  ) {}

  async createBlog(createBlogData: CreateBlogData): Promise<Blog> {
    const posts = createBlogData.posts.map((post) =>
      Post.createPost(null, post.content, 0, post.title),
    );

    const newBlog = Blog.createBlog(
      null,
      createBlogData.name,
      createBlogData.slug,
      posts,
    );

    try {
      return await this.blogRepository.createBlog(newBlog);
    } catch (err: unknown) {
      throw new InternalServerErrorException(
        'Internal server error while creating blog',
      );
    }
  }

  async createPostInBlog(
    id: string,
    createPostData: CreatePostData,
  ): Promise<Blog> {
    const foundBlog = await this.blogRepository.getBlog(id, true).catch(() => {
      throw new InternalServerErrorException(
        'Internal server error while fetching blog',
      );
    });

    if (!foundBlog) {
      throw new NotFoundException('Blog has not been found!');
    }

    const newPost = Post.createPost(
      null,
      createPostData.content,
      0,
      createPostData.title,
    );

    foundBlog.addPost(newPost);

    try {
      return await this.blogRepository.updateBlog(foundBlog);
    } catch (err: unknown) {
      throw new InternalServerErrorException(
        'Internal server error while updating blog',
      );
    }
  }

  async getBlog(id: string, shouldReturnPosts: boolean): Promise<Blog> {
    const blog = await this.blogRepository
      .getBlog(id, shouldReturnPosts)
      .catch(() => {
        throw new InternalServerErrorException(
          'Internal server error while fetching blog',
        );
      });

    if (!blog) {
      throw new NotFoundException('Blog has not been found!');
    }

    return blog;
  }
}
