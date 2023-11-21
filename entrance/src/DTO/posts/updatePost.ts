import Output from "@/DTO/posts/posts";

export class UpdateExactPostBodyDto {
  postId: number;
  userId: number;
  payload: {
    title: string;
    description: string;
  };
}

export class UpdateExactPostOutputDto extends Output {
  payload?: never;
}
