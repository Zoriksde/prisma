import { Inject } from '@nestjs/common';
import { Blog } from '../../../../domain/aggregates/blog/Blog';

export const BlogRepositoryToken = 'BlogRepositoryToken';

export interface IBlogRepository {
  createBlog(blog: Blog): Promise<Blog>;
  getBlog(id: string, shouldReturnPosts: boolean): Promise<Blog>;
  updateBlog(blog: Blog): Promise<Blog>;
}

export const InjectBlogRepository = () => Inject(BlogRepositoryToken);
