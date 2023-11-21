import { Post } from '@/Modules/postgres/Entities/post.entity';
import Output from '@/DTO/auth/auth';

export class GetPostsBodyDto {
  page: number;
}

export class GetPostsOutputDto extends Output {
  payload: {
    posts: Post[];
    hasMore: boolean;
  };
}
