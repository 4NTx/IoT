import { IsNotEmpty, IsString } from 'class-validator';

export class EsqueciSenhaDto {
    @IsNotEmpty({ message: 'O campo de login ou e-mail não pode ser vazio.' })
    @IsString()
    login: string;
}