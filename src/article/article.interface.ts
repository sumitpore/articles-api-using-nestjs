import { PublisherData, AuthorData } from '../user/user.interface';

export interface ArticleRO {
  image: string;
  url: string;
  headline: string;
  dateCreated?: Date
  datePublished?: Date
  dateModified?: Date
  inLanguage: string;
  author?: AuthorData;
  publisher?: PublisherData;
  keywords?: string[];
  articleSection?: string;
  articleBody?: string;
  contentLocation?: any;
}


export interface ArticlesRO {
  articles: ArticleRO[];
  articlesCount: number;
}

