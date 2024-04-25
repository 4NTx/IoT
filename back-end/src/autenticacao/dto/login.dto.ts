import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'O login não pode ser vazio.' })
  @IsString()
  login: string;

  @IsNotEmpty({ message: 'A senha não pode ser vazia.' })
  @IsString()
  senha: string;
}
