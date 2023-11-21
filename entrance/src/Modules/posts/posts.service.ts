import { Injectable } from '@nestjs/common';
import PostgresService from '@/Modules/postgres/postgres.service';
import {
  GetExactPostOutputDto,
  GetExactPostQueryDto,
} from '@/DTO/posts/getExactPost';
import { CreatePostBodyDto, CreatePostOutputDto } from '@/DTO/posts/createPost';
import {
  DeleteExactPostBodyDto,
  DeleteExactPostOutputDto,
} from '@/DTO/posts/deletePost';
import { GetPostsBodyDto, GetPostsOutputDto } from '@/DTO/posts/getPosts';
import {
  UpdateExactPostBodyDto,
  UpdateExactPostOutputDto,
} from '@/DTO/posts/updatePost';
import { GetAllPostsOutputDto } from "@/DTO/posts/getAllposts";

@Injectable()
export class PostsService {
  constructor(public readonly postgresService: PostgresService) {}

  async createNewPost(body: CreatePostBodyDto): Promise<CreatePostOutputDto> {
    const { userId, newPostData } = body;
    const newPostId = await this.postgresService.postService.createNewPost(
      userId,
      newPostData,
    );
    return {
      code: 201,
      isSucceed: true,
      message: 'POST_CREATE_SUCCEED',
      payload: {
        postId: newPostId,
      },
    };
  }

  async getAllPosts(): Promise<GetAllPostsOutputDto> {
    const posts = await this.postgresService.postService.getAllPosts();
    return {
      code: 200,
      isSucceed: true,
      message: 'POST_FOUND_SUCCEED',
      payload: {
        posts: posts,
      },
    };
  }

  async getExactPost(
    body: GetExactPostQueryDto,
  ): Promise<GetExactPostOutputDto> {
    const { postId } = body;
    const post = await this.postgresService.postService.getExactPost(postId);
    return {
      code: 200,
      isSucceed: true,
      message: 'POST_FOUND_SUCCEED',
      payload: post,
    };
  }

  async deletePost(
    body: DeleteExactPostBodyDto,
  ): Promise<DeleteExactPostOutputDto> {
    const { postId, userId } = body;
    await this.postgresService.postService.deletePost(postId, userId);
    return {
      code: 200,
      isSucceed: true,
      message: 'POST_DELETE_SUCCEED',
    };
  }

  async updatePost(
    body: UpdateExactPostBodyDto,
  ): Promise<UpdateExactPostOutputDto> {
    const { postId, userId, payload } = body;
    await this.postgresService.postService.changePost(postId, userId, payload);
    return {
      code: 201,
      isSucceed: true,
      message: 'POST_UPDATE_SUCCEED',
    };
  }

  async findPosts(body: GetPostsBodyDto): Promise<GetPostsOutputDto> {
    const { page } = body;
    const postsOutput = await this.postgresService.postService.findPosts(
      page,
      10,
    );
    return {
      code: 200,
      isSucceed: true,
      message: 'FIND_SUCCEED',
      payload: postsOutput,
    };
  }
}
