import { Injectable } from '@nestjs/common';
import UserRepo from '@/Modules/postgres/repositories/userRepo';
import PostRepo from '@/Modules/postgres/repositories/postRepo';
import { CreatePostBodyDto } from '@/DTO/posts/createPost';
import {
  DatabasePGError,
  NoPostError,
  NoUserError,
} from '@/Errors/postgresErrors/postgresErrors';
import { GetPostsOutputDto } from '@/DTO/posts/getPosts';
import { ExtendedError } from '@/Errors/errors';
import { Post } from '@/Modules/postgres/Entities/post.entity';

@Injectable()
export default class PostService {
  constructor(
    private readonly postRepo: PostRepo,
    private readonly userRepo: UserRepo,
  ) {}

  async createNewPost(
    userId: CreatePostBodyDto['userId'],
    postData: CreatePostBodyDto['newPostData'],
  ) {
    //Получаем айди пользователя по предоставленному, чтоб проверить. Если нет - ошибка.
    const user = await this.userRepo.findUserByUserId(userId);
    //Создаем новый пост, в котором возвращается айди его.
    if (!user) throw new NoUserError('NO_USER');
    return await this.postRepo.createPost(user, postData);
  }

  async findPosts(page = 1, take = 6): Promise<GetPostsOutputDto['payload']> {
    //Ищем посты
    const posts = await this.postRepo.getPosts(page, take);
    //Если постов нет, то вернем ошибку с 404
    if (posts.length === 0)
      throw new ExtendedError('NoPostsError', 'NO_POSTS', 404);
    //Если постов больше тейка, значит, есть еще
    const hasMore = posts && posts.length > take - 1;
    //Если постов больше take-1 - делаем take-1
    const slicedPosts = hasMore ? posts.slice(0, take - 1) : posts;
    return {
      posts: slicedPosts,
      hasMore,
    };
  }

  async getExactPost(postId: number) {
    const exactPost = await this.postRepo.findExactPost(postId);
    if (!exactPost) throw new NoPostError('NO_POST');
    return exactPost;
  }

  async changePost(postId: number, userId: number, payload: Partial<Post>) {
    //Получаем айди пользователя по предоставленному, чтоб проверить. Если нет - ошибка.
    const user = await this.userRepo.findUserByUserId(userId);
    if (!user) throw new NoUserError('NO_USER');
    //Ищем пост, в котором возвращается айди его.
    const post = await this.postRepo.findPostByPostId(postId);
    //Если айди пользователя != айди автора, ошибка
    if (post?.authorId !== user.userid)
      throw new ExtendedError('NO_ACCESS_ERROR', 'NO_ACCESS', 400);
    //Обновляем пост
    return await this.postRepo.updatePost(postId, payload);
  }
  async getAllPosts() {
    const posts = await this.postRepo.getAllPosts();
    if (posts.length === 0) throw new NoPostError('NO_POST');
    return posts;
  }
  async deletePost(postId: number, userId: number) {
    //Получаем айди пользователя по предоставленному, чтоб проверить. Если нет - ошибка.
    const user = await this.userRepo.findUserByUserId(userId);
    if (!user) throw new NoUserError('NO_USER');
    //Ищем пост, в котором возвращается айди его.
    const post = await this.postRepo.findPostByPostId(postId);
    //Если айди пользователя != айди автора, ошибка
    if (post.authorId !== user.userid)
      throw new ExtendedError('NO_ACCESS_ERROR', 'NO_ACCESS', 400);
    const result = await this.postRepo.deletePost(postId);
    if (!result.affected) throw new NoPostError('NO_POST_FOR_DELETE');
  }
}
