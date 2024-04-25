import { IsString, IsEmail, MinLength } from 'class-validator';

export class RegistroDto {
  @IsString()
  nome_usuario: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  senha: string;
}
