import bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { UsersService } from "src/users/users.service";
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.user({ email });
    if(!user) {
        throw new NotFoundException();
    }
    const isPassCorrect = bcrypt.compareSync(pass, user.password);
    if (!isPassCorrect) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, email: user.email, role: user.role, country: user.country };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
