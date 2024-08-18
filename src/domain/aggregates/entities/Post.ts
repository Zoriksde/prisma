import { uuid } from 'uuidv4';

export class Post {
  private readonly id: string;
  private readonly viewCount: number = 0;

  static createPost(
    id: string,
    content: string,
    viewCount: number,
    title?: string,
  ) {
    return new Post(id, content, viewCount, title);
  }

  private constructor(
    private readonly _id: string,
    private readonly content: string,
    private readonly _viewCount: number,
    private readonly title?: string,
  ) {
    this.viewCount = _viewCount;
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
