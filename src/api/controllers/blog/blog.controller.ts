import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { BlogService } from '../../../application/services/blog/blog.service';
import { CreateBlogRequest } from '../../contracts/blog/createBlogRequest';
import { CreateBlogResponse } from '../../contracts/blog/createBlogResponse';
import { GetBlogResponse } from '../../contracts/blog/getBlogResponse';
import { CreatePostRequest } from '../../contracts/blog/createPostRequest';
import { CreatePostResponse } from '../../contracts/blog/createPostResponse';

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
