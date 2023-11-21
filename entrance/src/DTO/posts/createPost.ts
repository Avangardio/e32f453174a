import Output from '@/DTO/posts/posts';
import { IsInt, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class NewPostData {
  @IsString()
  title: string;

  @IsString()
  description: string;
}

export class CreatePostBodyDto {
  @IsInt()
  userId: number;

  @ValidateNested()
  @Type(() => NewPostData)
  newPostData: {
    title: string;
    description: string;
  };
}

export class CreatePostOutputDto extends Output {
  payload: {
    postId: number;
  };
}
