import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert, JoinTable, ManyToMany, OneToMany} from "typeorm";
import { IsEmail } from 'class-validator';
import * as crypto from 'crypto';
import { ArticleEntity } from '../article/article.entity';

@Entity('user')
export class UserEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({default: ''})
  name: string;

  @Column()
  @IsEmail()
  email: string;

  @Column({default: ''})
  url: string;

  @Column({default: ''})
  image: string;

  @Column({default: 'author'})
  role: string;

  @Column()
  password: string;

  @BeforeInsert()
  hashPassword() {
    this.password = crypto.createHmac('sha256', this.password).digest('hex');
  }

  @OneToMany(type => ArticleEntity, article => article.author)
  articles: ArticleEntity[];

  @OneToMany(type => ArticleEntity, article => article.publisher)
  publisher_for_articles: ArticleEntity[];

}
