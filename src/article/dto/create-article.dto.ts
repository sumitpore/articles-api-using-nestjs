export class CreateArticleDto {
  readonly image: string;
  readonly slug: string;
  readonly headline: string;
  readonly articleBody: string;
  readonly inLanguage: string;
  readonly publisher: string;
  readonly keywords: string[];
  readonly articleSection: string;
}
