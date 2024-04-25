import { IsString, IsNotEmpty } from 'class-validator';

export class LoginUsuarioDto {
  @IsNotEmpty({ message: 'O campo de login não pode ser vazio.' })
  @IsString({ message: 'O campo de login deve ser uma string.' })
  login: string;

  @IsNotEmpty({ message: 'O campo de senha não pode ser vazio.' })
  @IsString({ message: 'A senha deve ser uma string.' })
  senha: string;
}
