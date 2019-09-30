import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, DeleteResult } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { UserEntity } from '../user/user.entity';
import { CreateArticleDto } from './dto/create-article.dto';

import { ArticleRO, ArticlesRO } from './article.interface';
import { BASEURL } from '../config';
import { AuthorData, PublisherData } from '../user/user.interface';
const slug = require('slug');

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async findAll(query, pending: boolean = false): Promise<ArticlesRO> {

    const qb = await this.articleRepository.createQueryBuilder('article');

    qb.where("1 = 1");

    if ('author' in query) {
      const author = await this.userRepository.findOne({username: query.author});
      qb.andWhere("article.author = :author_id", { author_id: author.id });
    }

    if ('publisher' in query) {
      const publisher = await this.userRepository.findOne({username: query.publisher});
      qb.andWhere("article.publisher = :publisher_id", { publisher_id: publisher.id });
    }

    if(pending == true) {
      qb.andWhere("article.published IS NULL");
    } else {
      qb.andWhere("article.published IS NOT NULL");
    }

    qb.orderBy('article.created', 'DESC');

    const articlesCount = await qb.getCount();

    if ('limit' in query) {
      qb.limit(query.limit);
    }

    if ('offset' in query) {
      qb.offset(query.offset);
    }

    const articleEntities = await qb.getMany();
    const articles: ArticleRO[] = [];

    const convertArticleEntitiesToROs = async () => {
      await this.asyncForEach(articleEntities, async (article) => {
        const articleRO = await this.convertEntityToRO(article);
        articles.push(articleRO);
      });
      return articles;
    }

    await convertArticleEntitiesToROs();

    return {articles, articlesCount};
  }

  async findOne(where, userId): Promise<ArticleRO> {
    const article = await this.articleRepository.findOne(where);

    if(article == undefined) {
      throw new NotFoundException('Article Not Found!');
    }

    if(article.published == null) {

      if(article.publisher == userId || article.author == userId) {
        return this.convertEntityToRO(article);
      }

      // On production, we don't have to handle this. We can only send normal 404.
      throw new NotFoundException('Article is not published yet. Try again later!'); 
    }

    return this.convertEntityToRO(article);
  }

  async create(userId: number, articleData: CreateArticleDto): Promise<ArticleRO> {
    return this.save(userId, articleData);

  }

  async save(userId: number, newArticleData: CreateArticleDto, slug?: string): Promise<ArticleRO>  {

    let article = new ArticleEntity();

    if(slug != null) {

      let existingArticle = await this.articleRepository.findOne({ slug: slug });
    
      if(existingArticle == undefined) {
        throw new NotFoundException('Article Not Found!');
      }

      if(existingArticle.author !== userId) {
        throw new UnauthorizedException('You can only edit articles written by you!');
      }

      article.slug = slug;
      article.id = existingArticle.id;

    } else {
      article.slug = this.slugify(newArticleData.headline);
    }

    article.image = newArticleData.image;
    article.headline = newArticleData.headline;
    article.articleBody = newArticleData.articleBody;
    article.inLanguage = newArticleData.inLanguage;
    article.keywords = newArticleData.keywords || [];
    article.articleSection = newArticleData.articleSection;

    const author = await this.userRepository.findOne(userId);
    article.author = author.id;

    const publisher = await this.userRepository.findOne({ where: { username: newArticleData.publisher } });

    if(publisher !== undefined) {
      article.publisher = publisher.id;
    }

    const newArticle = await this.articleRepository.save(article);

    return this.convertEntityToRO(newArticle);
  }

  async findPending(username: string, userRole: string, query): Promise<ArticlesRO> {

    if(userRole == 'publisher') {
      return this.findAll({
        ...query,
        publisher: username
      }, true);
    } 

    return this.findAll({
      ...query,
      author: username
    }, true);

  }

  async publish(userId: number, slug: string): Promise<ArticleRO> {
    const articleData = await this.articleRepository.findOne({ slug: slug });

    if(articleData.publisher !== undefined && articleData.publisher !== userId) {
      throw new UnauthorizedException('You are not allowed to Publish the Article!');
    }
    
    if(articleData.published === null) {
      articleData.published = new Date();
      
      const article = await this.articleRepository.save(articleData);

      return this.convertEntityToRO(article);
    }
    
    return this.convertEntityToRO(articleData);
    
  }

  async update(userId: number,slug: string, articleData: any): Promise<ArticleRO> {
    return this.save(userId, articleData, slug);
  }

  async delete(userId: number, slug: string): Promise<DeleteResult> {

    let existingArticle = await this.articleRepository.findOne({ slug: slug });
    
    if(existingArticle == undefined) {
      throw new NotFoundException('Article Not Found!');
    }

    if(existingArticle.author !== userId) {
      throw new UnauthorizedException('You can only delete articles written by you!');
    }

    return await this.articleRepository.delete({ slug: slug});
  }

  async convertEntityToRO(articleEntity: ArticleEntity): Promise<ArticleRO> {
      let articleRO = {} as ArticleRO;
      articleRO.image = articleEntity.image;
      articleRO.url = BASEURL + 'articles/' + articleEntity.slug;
      articleRO.headline = articleEntity.headline;
      articleRO.dateCreated = articleEntity.created;
      articleRO.datePublished = articleEntity.published;
      articleRO.dateModified = articleEntity.updated;
      articleRO.inLanguage = articleEntity.inLanguage;
      
      articleRO.contentLocation = {
        name: "Atlanta, GA"
      };

      // Author
      const author = await this.userRepository.findOne({ where: { id: articleEntity.author } });

      articleRO.author = (author !== undefined && author !== null ) ? { name: author.name, url: author.url }: {} as AuthorData;

      // Publisher
      const publisher = await this.userRepository.findOne({ where: { id: articleEntity.publisher } });
      articleRO.publisher = {} as PublisherData;
      if(publisher !== undefined && publisher !== null ) {
        articleRO.publisher = {
          name : publisher.name,
          url :  publisher.url,
          logo : {
            image : publisher.image,
            width:​ 400​,
            height:​ 55
          }
        };
      }

      articleRO.keywords = articleEntity.keywords;
      articleRO.articleSection = articleEntity.articleSection;
      articleRO.articleBody = articleEntity.articleBody;

      return articleRO;
  }

  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  slugify(title: string) {
    return slug(title, {lower: true}) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36)
  }

}
