import { Post } from '@/Modules/postgres/Entities/post.entity';
import Output from '@/DTO/auth/auth';

export class GetAllPostsOutputDto extends Output {
  payload: {
    posts: Post[];
  };
}
