import Output from "@/DTO/posts/posts";

export class DeleteExactPostBodyDto {
  postId: number;
  userId: number;
}

export class DeleteExactPostOutputDto extends Output {
  payload?: never;
}
