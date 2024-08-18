export class CreateBlogData {
  name: string;
  slug: string;
  posts: Post[];
}

class Post {
  content: string;
  title?: string;
}
