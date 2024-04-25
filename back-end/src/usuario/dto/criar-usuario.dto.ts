import {
  IsString,
  IsEmail,
  MinLength,
  IsEnum,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { Cargo } from '../entities/usuario.entity';

export class CriarUsuarioDto {
  @IsNotEmpty({ message: 'O nome de usuário não pode ser vazio.' })
  @IsString({ message: 'O nome de usuário deve ser uma string.' })
  @MinLength(4, {
    message: 'O nome de usuário deve ter no mínimo 4 caracteres.',
  })
  nome_usuario: string;

  @IsNotEmpty({ message: 'O email não pode ser vazio.' })
  @IsEmail({}, { message: 'O email fornecido não é válido.' })
  email: string;

  @IsNotEmpty({ message: 'A senha não pode ser vazia.' })
  @IsString({ message: 'A senha deve ser uma string.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  senha: string;

  @IsEnum(Cargo, { message: 'O cargo não é válido.' })
  @IsOptional()
  cargo: Cargo = Cargo.USUARIO;
}
