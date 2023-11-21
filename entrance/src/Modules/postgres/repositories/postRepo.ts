import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/Modules/postgres/Entities/user.entity';
import { Repository } from 'typeorm';
import { Post } from '@/Modules/postgres/Entities/post.entity';
import { DatabasePGError } from '@/Errors/postgresErrors/postgresErrors';
import { CreatePostBodyDto } from '@/DTO/posts/createPost';

@Injectable()
export default class PostRepo {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async createPost(user: User, postData: CreatePostBodyDto['newPostData']) {
    const { title, description } = postData;
    const post = new Post();
    post.title = title;
    post.description = description;
    post.author = user; // Устанавливаем связь с пользователем

    // Сохраните пост в базе данных
    const savedPost = await this.postRepository.save(post).catch((error) => {
      throw new DatabasePGError('POST_CREATE_ERROR', error.message);
    });
    return savedPost.postId;
  }
  async getAllPosts() {
    return this.postRepository.find().catch((error) => {
      throw new DatabasePGError('POST_SEARCH_ERROR', error.message);
    });
  }
  async getPosts(page = 1, take = 6): Promise<Post[]> {
    const skip = (page - 1) * (take - 1); // Пропустить предыдущие страницы
    // Базовые условия для поиска

    return await this.postRepository
      .find({
        take: take,
        relations: ['author'],
        select: {
          author: {
            email: true,
            userid: true,
          },
        },
        skip: skip,
        order: { postId: 'DESC' },
      })
      .catch((error) => {
        throw new DatabasePGError('POST_SEARCH_ERROR', error.message);
      });
  }

  findPostByPostId(postId: number, selectFields?: (keyof Post)[]) {
    //Пытаемся получить данные по имейлу
    return this.postRepository
      .findOne({
        where: { postId: postId },
        ...(selectFields &&
          selectFields.length > 0 && { select: selectFields }),
        relations: ['author'],
        select: {
          author: {
            email: true,
            userid: true,
          },
        },
        cache: {
          id: `post_by_id_${postId}`,
          milliseconds: 120_000,
        },
      })
      .catch((error) => {
        throw new DatabasePGError('NO_POST', error.message);
      });
  }

  findExactPost(postId: number) {
    return this.postRepository
      .findOne({
        where: { postId: postId },
        relations: ['author'],
        select: {
          author: {
            email: true,
            userid: true,
          },
        },
      })
      .catch((error) => {
        throw new DatabasePGError('POST_SEARCH_ERROR', error.message);
      });
  }

  updatePost(postId: number, payload: Partial<Post>) {
    return this.postRepository.update(
      {
        postId: postId,
      },
      {
        ...payload,
      },
    );
  }

  deletePost(postId: number) {
    return this.postRepository.delete({
      postId: postId,
    });
  }
}
