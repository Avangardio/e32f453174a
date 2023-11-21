import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import UserRepo from '@/Modules/postgres/repositories/userRepo';
import PostService from '@/Modules/postgres/post.service';
import { Post } from '@/Modules/postgres/Entities/post.entity';
import { Test } from '@nestjs/testing';
import PostRepo from '@/Modules/postgres/repositories/postRepo';

const moduleMocker = new ModuleMocker(global);

describe('PostService', () => {
  let postService: PostService;
  const postRepoMock = {
    createPost: jest.fn().mockResolvedValue(42),
    findExactPost: jest.fn().mockResolvedValue(new Post()),
    increasePostViews: jest.fn().mockResolvedValue(1),
    deletePost: jest.fn().mockResolvedValue({ affected: 1 }),
    findPopularPosts: jest.fn().mockResolvedValue([new Post()]),
    getPosts: jest.fn().mockResolvedValue([new Post(), new Post()]),
    findPostByPostId: jest.fn().mockResolvedValue(1),
    updatePost: jest.fn().mockResolvedValue({ affected: 1 }),
    getAllPosts: jest.fn().mockResolvedValue([new Post()]),
  };
  const userRepoMock = {
    findUserByUserId: jest.fn().mockResolvedValue({ userId: 1 }),
  };
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [PostService],
    })
      .useMocker((token) => {
        if (token === UserRepo) {
          return userRepoMock;
        }
        if (token === PostRepo) {
          return postRepoMock;
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    postService = moduleRef.get(PostService);
  });
  it('Должен инициализироваться', function () {
    expect(postService).toBeDefined();
  });
  it('CreateNewPost', async () => {
    const result = await postService.createNewPost(1, {
      description: 'description',
      title: 'Test title',
    });
    expect(typeof result).toBe('number');
  });
  it('getExactPost - с постом', async () => {
    const result = await postService.getExactPost(1);
    expect(result).toBeInstanceOf(Post);
  });
  it('getExactPost - без поста', async () => {
    postRepoMock.findExactPost = jest.fn().mockResolvedValue(null);
    await expect(postService.getExactPost(4242)).rejects.toThrow('NO_POST');
  });
  it('findPosts - с постом', async () => {
    const result = await postService.findPosts(1, 6);
    expect(typeof result.hasMore).toBe('boolean');
    expect(result.posts.length).toBe(2);
  });
  it('findPosts - без постов', async () => {
    postRepoMock.getPosts = jest
      .fn()
      .mockResolvedValue({ posts: [], hasMore: false });
    await expect(postService.getExactPost(4242)).rejects.toThrow('NO_POST');
  });
  it('deletePost - с юзером', async () => {
    const result = await postService.deletePost(1, 1);
    expect(result);
  });
  it('deletePost - без юзера', async () => {
    userRepoMock.findUserByUserId = jest.fn().mockResolvedValue(undefined);
    await expect(postService.deletePost(1, 1)).rejects.toThrow('NO_USER');
  });
  it('changePost - с юзером', async () => {
    userRepoMock.findUserByUserId = jest.fn().mockResolvedValue(1);
    const result = await postService.changePost(1, 1, { title: 'text' });
    expect(result);
  });
  it('changePost - без юзера', async () => {
    userRepoMock.findUserByUserId = jest.fn().mockResolvedValue(undefined);
    await expect(
      postService.changePost(1, 1, { description: 'description' }),
    ).rejects.toThrow('NO_USER');
  });
  it('changePost - с постами', async () => {
    const result = await postService.getAllPosts();
    expect(result);
  });
  it('getAllPosts - без постов', async () => {
    postRepoMock.getAllPosts = jest.fn().mockResolvedValue([]);
    await expect(postService.getAllPosts()).rejects.toThrow('NO_POST');
  });
});
