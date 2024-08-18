/**
 * Although such response looks exactly the same as CreatePostResponse or GetBlogResponse, it's possible to let them
 * differ in the future, when the requirements slightly change. Certain endpoints may or may not return some fields,
 * or they can serialize some properties. Dividing the responses into couple of classes makes it more readable and simplify
 * the maintaining of API response contracts.
 */
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
