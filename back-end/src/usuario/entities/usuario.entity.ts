import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { IsEnum } from 'class-validator';

export enum Cargo {
  USUARIO = 'USUARIO',
  EDITOR = 'EDITOR',
  ADMIN = 'ADMIN',
}

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Index('nome_usuario_idx')
  nome_usuario: string;

  @Column({ unique: true })
  @Index('email_idx')
  email: string;

  @Column()
  senha: string;

  @Column({ type: 'enum', enum: Cargo, default: Cargo.USUARIO })
  @IsEnum(Cargo)
  cargo: Cargo;
}
