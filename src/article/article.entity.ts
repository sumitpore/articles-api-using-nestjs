import { Entity, PrimaryGeneratedColumn, Column, BeforeUpdate } from 'typeorm';

@Entity('article')
export class ArticleEntity {

  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(type => UserEntity, user => user.articles)
  @Column({ type: "int", nullable: true })
  author: number;

  @Column({default: ''})
  image: string;

  @Column()
  slug: string;

  @Column()
  headline: string;

  @Column({default: ''})
  articleBody: string;

  @Column({default: ''})
  inLanguage: string;

  @Column({ type: "int", nullable: true })
  publisher: number;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  created: Date;

  @Column({ type: 'timestamp', nullable: true })
  published: Date;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  updated: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date;
  }

  @Column('simple-array')
  keywords: string[];

  @Column({default: ''})
  articleSection: string;

}