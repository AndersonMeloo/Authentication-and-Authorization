import { Injectable } from '@nestjs/common';
import { LoginDto } from './login.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import bcrypt from 'bcrypt';
import { CalsAbilityService } from 'src/cals/cals-ability/cals-ability.service';
import { packRules } from '@casl/ability/extra';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
    private abilityService: CalsAbilityService,
  ) {}

  async login(LoginDto: LoginDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email: LoginDto.email },
    });

    if (!user) {
      throw new Error('Invalid Credentials');
    }

    const isPassowordValid = bcrypt.compareSync(
      LoginDto.password,
      user.password,
    );

    if (!isPassowordValid) {
      throw new Error('Invalid Credentials');
    }

    const ability = this.abilityService.createForUser(user);
    const token = this.jwtService.sign({
      name: user.name,
      email: user.email,
      role: user.role,
      sub: user.id,
      permissions: packRules(ability.rules),
    });
    return { access_token: token };
  }
}
