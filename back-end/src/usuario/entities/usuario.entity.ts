import { Entity, PrimaryGeneratedColumn, Column, Index, In, BeforeInsert } from 'typeorm';
import { IsEnum } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

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
  @Index('senha_idx')
  senha: string;

  @Column({ type: 'enum', enum: Cargo, default: Cargo.USUARIO })
  @Index('cargo_idx')
  @IsEnum(Cargo)
  cargo: Cargo;

  @Column({ nullable: true })
  recuperacaoSenhaUUID: string;

  @BeforeInsert()
  gerarUUID() {
    this.recuperacaoSenhaUUID = uuidv4();
  }
}