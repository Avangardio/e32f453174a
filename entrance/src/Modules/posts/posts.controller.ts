import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostBodyDto } from '@/DTO/posts/createPost';
import { JwtGuard } from '@/Guards/jwt.guard';
import { DeleteExactPostBodyDto } from '@/DTO/posts/deletePost';
import { Request, Response } from 'express';
import { ExtendedErrorFilter } from '@/Errors/errors.filter';
import { ValidationPipeExt } from '@/Pipes/ValidationPipe';
import { UpdateExactPostBodyDto } from '@/DTO/posts/updatePost';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('findPosts/:page')
  @UseFilters(ExtendedErrorFilter)
  @UsePipes(new ValidationPipe({ transform: true }))
  async findPosts(
    @Param('page') page: number,
    @Res({ passthrough: true }) response: Response,
  ) {
    const postsResponse = await this.postsService.findPosts({
      page: +page,
    });
    response.status(postsResponse.code);
    return postsResponse;
  }

  @Post('createPost')
  @UseFilters(ExtendedErrorFilter)
  @UseGuards(JwtGuard)
  @UsePipes(ValidationPipeExt)
  async createPost(
    @Body() body: CreatePostBodyDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const createResponse = await this.postsService.createNewPost(body);
    response.status(createResponse.code);
    return createResponse;
  }

  @Get('findExactPost')
  @UseFilters(ExtendedErrorFilter)
  @UsePipes(ValidationPipeExt)
  async findExactPost(
    @Query()
    query: { postId: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    const { postId } = query;
    const article = await this.postsService.getExactPost({
      postId: +postId || undefined,
    });
    response.status(article.code);
    return article;
  }

  @Patch('updatePost')
  @UseFilters(ExtendedErrorFilter)
  @UseGuards(JwtGuard)
  @UsePipes(ValidationPipeExt)
  async updatePost(
    @Body() body: UpdateExactPostBodyDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const updateResponse = await this.postsService.updatePost(body);
    response.status(updateResponse.code);
    return updateResponse;
  }

  @Get('getAllPosts')
  @UseFilters(ExtendedErrorFilter)
  async getAllPosts(@Res({ passthrough: true }) response: Response) {
    const postsResponse = await this.postsService.getAllPosts();
    response.status(postsResponse.code);
    return postsResponse;
  }

  @Delete('deletePost')
  @UseFilters(ExtendedErrorFilter)
  @UseGuards(JwtGuard)
  @UsePipes(ValidationPipeExt)
  async deletePost(
    @Body() body: DeleteExactPostBodyDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const deleteResponse = await this.postsService.deletePost(body);
    response.status(deleteResponse.code);
    return deleteResponse;
  }
}
