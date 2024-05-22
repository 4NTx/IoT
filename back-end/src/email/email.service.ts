import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter, SendMailOptions } from 'nodemailer';
import { compile } from 'handlebars';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);
    private transportador: Transporter;

    constructor(private configService: ConfigService) {
        this.inicializarTransportador();
    }

    private inicializarTransportador(): void {
        try {
            this.transportador = nodemailer.createTransport({
                host: this.configService.get<string>('email.host', 'smtp.gmail.com'),
                port: this.configService.get<number>('email.porta', 587),
                secure: this.configService.get<boolean>('email.seguro', false),
                auth: {
                    user: this.configService.get<string>('email.email'),
                    pass: this.configService.get<string>('email.senha'),
                },
            });
            this.logger.log('Transportador Nodemailer inicializado com sucesso.');
        } catch (erro) {
            this.logger.error('Falha ao inicializar o transportador Nodemailer', erro.stack);
            throw new Error('Erro na inicialização do transportador');
        }
    }

    private carregarTemplate(caminhoTemplate: string, contexto: object): { assunto: string, html: string } {
        try {
            const caminhoCompleto = join(__dirname, '..', 'email', 'templates', caminhoTemplate);
            const conteudo = readFileSync(caminhoCompleto, 'utf-8');

            const correspondenciaAssunto = conteudo.match(/{{!assunto="(.*?)"}}/);
            const assunto = correspondenciaAssunto ? correspondenciaAssunto[1] : 'Sem Assunto';

            const template = compile(conteudo);
            const html = template(contexto);
            return { assunto, html };
        } catch (erro) {
            this.logger.error(`Falha ao carregar template de email: ${caminhoTemplate}`, erro.stack);
            throw new Error('Erro ao carregar o template');
        }
    }

    async enviarEmail(caminhoTemplate: string, contexto: object, opcoesEmail: Partial<SendMailOptions>): Promise<void> {
        const { assunto, html } = this.carregarTemplate(caminhoTemplate, contexto);
        const opcoesFinais = {
            from: this.configService.get<string>('email.usuario'),
            ...opcoesEmail,
            subject: assunto,
            html,
        };

        try {
            await this.transportador.sendMail(opcoesFinais);
            this.logger.log(`Email enviado para ${opcoesFinais.to} com o assunto "${assunto}"`);
        } catch (erro) {
            this.logger.error(`Falha ao enviar email para ${opcoesFinais.to}`, erro.stack);
            throw new Error('Erro ao enviar o email');
        }
    }
}