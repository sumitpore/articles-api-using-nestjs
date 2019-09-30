import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {

  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly url: string;

  @IsNotEmpty()
  readonly image: string;

  @IsNotEmpty()
  readonly role: string;

  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}