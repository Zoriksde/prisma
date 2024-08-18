import { uuid } from 'uuidv4';
import { Post } from './entities/Post';

/**
 * Such entities doesn't have to be data centric only, it can encapsulate the behaviour of its entity.
 * The responsibility of mutating the state or interacting with certain properties, should be done in domain layer
 * instead of application one. Such encapsulation would be in one place, which definitely reduces the need of writing
 * specific logic couple of times.
 */

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
