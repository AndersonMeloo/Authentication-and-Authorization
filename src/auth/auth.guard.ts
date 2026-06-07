import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Roles } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CalsAbilityService } from 'src/cals/cals-ability/cals-ability.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
    private abilityService: CalsAbilityService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];
    // [Bearer, token]

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = this.jwtService.verify<{
        name: string;
        email: string;
        role: Roles;
        sub: string;
        permissions: string[];
      }>(token, {
        algorithms: ['HS256'],
      });
      // Pegar o usuario do payload e adicionar ao request
      const user = await this.prismaService.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      request.user = user;
      this.abilityService.createForUser(user);
      return true;
    } catch (e) {
      console.error(e);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
