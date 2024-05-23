import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RedefinirSenhaDto {
    @IsNotEmpty({ message: 'O token não pode ser vazio.' })
    @IsString()
    token: string;

    @IsNotEmpty({ message: 'A nova senha não pode ser vazia.' })
    @IsString()
    @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
    novaSenha: string;
}