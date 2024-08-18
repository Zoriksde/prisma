/**
 * Application layer's contracts can slightly differ between API contracts (e.g it can contain decoded authentication
 * token etc.). Due to the fact that application layer is triggered whenever the API layer will execute the call, we're
 * pretty sure that the data is already validated.
 */

export class CreateBlogData {
  name: string;
  slug: string;
  posts: Post[];
}

class Post {
  content: string;
  title?: string;
}
