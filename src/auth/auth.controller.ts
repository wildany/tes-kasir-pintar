import { Controller, Post, Body, Get, Logger, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private logger = new Logger('Auth Controller');
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async create(@Body() createAuthDto: CreateAuthDto, @Req() req) {
    this.logger.verbose(
      `${req.ip} registering new user "${createAuthDto.username}"`,
    );
    return this.authService.create(createAuthDto);
  }

  @Post('/login')
  async login(@Body() loginAuthDto: LoginAuthDto, @Req() req) {
    this.logger.verbose(
      `${req.ip} trying login with username "${loginAuthDto.username}"`,
    );
    const user = await this.authService.login(loginAuthDto);
    const token = this.authService.generateToken({
      id: user.id,
      username: user.username,
    });
    return {
      status: 'success',
      data: token,
    };
  }

  @Get()
  async find() {
    return this.authService.findAll();
  }
}
