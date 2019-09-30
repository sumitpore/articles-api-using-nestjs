import {Get, Post, Body, Put, Delete, Query, Param, Controller, UseGuards } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticlesRO, ArticleRO } from './article.interface';
import { User } from '../user/user.decorator';
import { Roles } from '../shared/decorators/roles.decorator';
import { RolesGuard } from '../shared/guards/roles.guard';

@Controller('articles')
@UseGuards(RolesGuard)
export class ArticleController {

  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async findAll(@Query() query): Promise<ArticlesRO> {
    return await this.articleService.findAll(query);
  }

  @Get('/pending')
  async findPending(@User('username') username: string, @User('role') userRole: string, @Query() query): Promise<ArticlesRO> {
    return await this.articleService.findPending(username, userRole, query);
  }

  @Get(':slug')
  async findOne(@User('id') userId: number, @Param('slug') slug): Promise<ArticleRO> {
    return await this.articleService.findOne({slug}, userId);
  }

  @Post()
  async create(@User('id') userId: number, @Body('article') articleData: CreateArticleDto): Promise<ArticleRO> {
    return await this.articleService.create(userId, articleData);
  }


  @Roles('publisher')
  @Post('/publish/:slug')
  async publish(@User('id') userId: number, @Param('slug') slug): Promise<ArticleRO> {
    return await this.articleService.publish(userId, slug);
  }

  @Put(':slug')
  async update(@User('id') userId: number, @Param('slug') slug, @Body('article') articleData: CreateArticleDto) {
    return this.articleService.update(userId, slug, articleData);
  }

  @Delete(':slug')
  async delete(@User('id') userId: number, @Param('slug') slug) {
    return this.articleService.delete(userId, slug);
  }

}