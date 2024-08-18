import { uuid } from 'uuidv4';
import { Post } from './entities/Post';

export class Blog {
  private readonly id: string;

  static createBlog(id: string, name: string, slug: string, posts: Post[]) {
    return new Blog(id, name, slug, posts);
  }

  private constructor(
    private readonly _id: string,
    private readonly name: string,
    private readonly slug: string,
    private readonly posts: Post[],
  ) {
    this.id = _id ?? uuid();
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getSlug(): string {
    return this.slug;
  }

  getPosts(): Post[] {
    return this.posts;
  }

  addPost(post: Post): Blog {
    this.posts.push(post);

    return this;
  }
}
