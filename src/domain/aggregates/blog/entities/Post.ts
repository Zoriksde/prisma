import { uuid } from 'uuidv4';

export class Post {
  private readonly id: string;

  static createPost(
    id: string,
    content: string,
    viewCount: number,
    title?: string,
  ) {
    return new Post(id, content, viewCount, title ? title : undefined);
  }

  private constructor(
    private readonly _id: string,
    private readonly content: string,
    private readonly viewCount: number,
    private readonly title?: string,
  ) {
    this.id = _id ?? uuid();
  }

  getId(): string {
    return this.id;
  }

  getTitle(): string {
    return this.title;
  }

  getContent(): string {
    return this.content;
  }

  getViewCount(): number {
    return this.viewCount;
  }
}
