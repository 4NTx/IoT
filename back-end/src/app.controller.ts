import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { EditorAuthGuard } from './autenticacao/guards/editor.authguard';
import { AdminAuthGuard } from './autenticacao/guards/admin.authguard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get() 
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('usuario')
  rotaUsuario(): string {
    return this.appService.getHello();
  }

  @UseGuards(EditorAuthGuard)
  @Get('editor')
  rotaEditor(): string {
    return this.appService.getHello();
  }

  @UseGuards(AdminAuthGuard)
  @Get('admin')
  rotaAdmin(): string {
    return this.appService.getHello();
  }
}
