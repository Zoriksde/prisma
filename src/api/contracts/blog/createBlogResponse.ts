export class CreateBlogResponse {
  id: string;
  name: string;
  slug: string;
  posts: PostResponse[];

  constructor(id: string, name: string, slug: string, posts: PostResponse[]) {
    Object.assign(this, { id: id, name: name, slug: slug, posts: posts });
  }
}

class PostResponse {
  id: string;
  title?: string;
  content: string;
  viewCount: number;
}
