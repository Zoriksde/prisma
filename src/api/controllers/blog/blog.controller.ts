import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { BlogService } from '../../../application/services/blog/blog.service';
import { CreateBlogRequest } from '../../contracts/blog/createBlogRequest';
import { CreateBlogResponse } from '../../contracts/blog/createBlogResponse';
import { GetBlogResponse } from '../../contracts/blog/getBlogResponse';
import { CreatePostRequest } from '../../contracts/blog/createPostRequest';
import { CreatePostResponse } from '../../contracts/blog/createPostResponse';

/**
 * Due to the fact that post entity is strictly related to blog entity (blog entity is kind of an aggregate entity
 * which contains multiple post entities), I've decided to put all post related actions into blog controller, as they
 * should be executed only within specific blog aggregate context.
 *
 * NOTE: It can be the use case to retrieve all of the posts from the database, without having to specify the blog entity
 * context. It's fine, as long as we want to have only read access to them. We can create separate repository which would
 * handle such cases without introducing blog entity context.
 */
@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get(':id')
  async getBlog(
    @Param() params: { id: string },
    @Query('return_posts') shouldReturnPosts: boolean,
  ): Promise<GetBlogResponse> {
    const foundBlog = await this.blogService.getBlog(
      params.id,
      shouldReturnPosts,
    );

    return new GetBlogResponse(
      foundBlog.getId(),
      foundBlog.getName(),
      foundBlog.getSlug(),
      foundBlog.getPosts().map((post) => ({
        id: post.getId(),
        title: post.getTitle(),
        content: post.getContent(),
        viewCount: post.getViewCount(),
      })),
    );
  }

  @Post()
  async createBlog(
    @Body() createBlogRequest: CreateBlogRequest,
  ): Promise<CreateBlogResponse> {
    const newBlog = await this.blogService.createBlog(createBlogRequest);

    return new CreateBlogResponse(
      newBlog.getId(),
      newBlog.getName(),
      newBlog.getSlug(),
      newBlog.getPosts().map((post) => ({
        id: post.getId(),
        title: post.getTitle(),
        content: post.getContent(),
        viewCount: post.getViewCount(),
      })),
    );
  }

  @Post(':id/posts')
  async createPostInBlog(
    @Param() params: { id: string },
    @Body() createPostRequest: CreatePostRequest,
  ): Promise<CreatePostResponse> {
    const blog = await this.blogService.createPostInBlog(
      params.id,
      createPostRequest,
    );

    return new CreatePostResponse(
      blog.getId(),
      blog.getName(),
      blog.getSlug(),
      blog.getPosts().map((post) => ({
        id: post.getId(),
        title: post.getTitle(),
        content: post.getContent(),
        viewCount: post.getViewCount(),
      })),
    );
  }
}
