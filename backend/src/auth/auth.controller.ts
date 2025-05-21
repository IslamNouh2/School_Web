import { Body, Controller, Post, Req, Res, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthDto } from './dto/auth.dto';  // Make sure you're using AuthDto for login

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  async signUp(@Body() dto: CreateAuthDto) {
    try {
      return await this.authService.signup(dto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('login')
  async login(@Body() dto: AuthDto, @Req() req, @Res() res) {
    try {
      return await this.authService.login(dto, req, res);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
