import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  // User registration endpoint
  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    const existingUser = await this.usersService.findByUsername(body.username);
    if (existingUser) {
      throw new HttpException('Username already exists', HttpStatus.BAD_REQUEST);
    }
    const user = await this.usersService.createUser(body.username, body.password);
    return { message: 'User registered successfully', userId: user._id };
  }

  // User login endpoint
  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.authService.validateUser(body.username, body.password);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const token = await this.authService.login(user);
    return token;
  }
}
