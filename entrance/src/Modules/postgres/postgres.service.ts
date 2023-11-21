import { Injectable } from "@nestjs/common";
import UserService from "@/Modules/postgres/user.service";
import PostService from "@/Modules/postgres/post.service";

@Injectable()
export default class PostgresService {
  constructor(
    public readonly userService: UserService,
    public readonly postService: PostService
  ) {
  }
}
