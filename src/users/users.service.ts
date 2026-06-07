import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { CalsAbilityService } from 'src/cals/cals-ability/cals-ability.service';
import { accessibleBy } from '@casl/prisma';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private abilityService: CalsAbilityService,
  ) {}

  create(createUserDto: CreateUserDto) {
    const ability = this.abilityService.ability;

    if (!ability.can('create', 'User')) {
      throw new Error('Unauthorized');
    }

    const { permissions, ...createData } = createUserDto;

    return this.prismaService.user.create({
      data: {
        ...createData,
        ...(permissions !== undefined
          ? { permissions: permissions as Prisma.InputJsonValue }
          : {}),
        password: bcrypt.hashSync(createUserDto.password, 10),
      },
    });
  }

  findAll() {
    const ability = this.abilityService.ability;

    return this.prismaService.user.findMany({
      where: {
        AND: [accessibleBy(ability, 'read').ofType('User')],
      },
    });
  }

  findOne(id: string) {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const { permissions, ...updateData } = updateUserDto;

    return this.prismaService.user.update({
      where: { id },
      data: {
        ...updateData,
        ...(permissions !== undefined
          ? { permissions: permissions as Prisma.InputJsonValue }
          : {}),
      },
    });
  }

  remove(id: string) {
    return this.prismaService.user.delete({
      where: { id },
    });
  }
}
