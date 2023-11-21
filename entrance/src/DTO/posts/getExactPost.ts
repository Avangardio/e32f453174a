import Output from "@/DTO/posts/posts";
import { IsNumberString } from "class-validator";
import { Type } from "class-transformer";

export class GetExactPostQueryDto {
  @IsNumberString()
  @Type(() => Number)
  postId: number;
}

export class GetExactPostOutputDto extends Output {
  payload: object;
}
