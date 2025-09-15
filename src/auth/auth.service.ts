import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Validate user credentials
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.validateUser(username, pass);

    if (user) {
      // Cast to UserDocument to get access to toObject()
      const docUser = user as UserDocument;
      const { password, ...result } = docUser.toObject();
      return result;
    }

    return null;
  }

  // Generate JWT token
  async login(user: any) {
    const payload = { username: user.username, sub: user._id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
