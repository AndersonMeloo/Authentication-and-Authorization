import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CalsAbilityService } from 'src/cals/cals-ability/cals-ability.service';
import { accessibleBy } from '@casl/prisma';

@Injectable()
export class PostsService {
  constructor(
    private prismaService: PrismaService,
    private abilityService: CalsAbilityService,
  ) {}

  create(createPostDto: CreatePostDto & { authorId: string }) {
    const ability = this.abilityService.ability;

    if (!ability.can('create', 'Post')) {
      throw new Error('Unauthorized');
    }

    return this.prismaService.post.create({
      data: createPostDto,
    });
  }

  async findAll() {
    const ability = this.abilityService.ability;

    // if (!ability.can('read', 'Post')) {
    //   throw new Error('Unauthorized');
    // }

    return this.prismaService.post.findMany({
      where: {
        AND: [accessibleBy(ability, 'read').ofType('Post')],
      },
    });
  }

  findOne(id: string) {
    const ability = this.abilityService.ability;

    if (!ability.can('read', 'Post')) {
      throw new Error('Unauthorized'); // 403
    }

    return this.prismaService.post.findUnique({
      where: {
        id,
        AND: [accessibleBy(ability, 'read').ofType('Post')],
      },
    });
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const ability = this.abilityService.ability;

    const post = await this.prismaService.post.findUnique({
      where: {
        id,
        AND: [accessibleBy(ability, 'update').ofType('Post')],
      },
    });

    if (!post) {
      throw new Error('Post not found or unauthorized'); // 404 or 403
    }

    return this.prismaService.post.update({
      where: { id },
      data: updatePostDto,
    });
  }

  async remove(id: string) {
    const ability = this.abilityService.ability;

    const post = await this.prismaService.post.findUnique({
      where: {
        id,
        AND: [accessibleBy(ability, 'delete').ofType('Post')],
      },
    });

    if (!post) {
      throw new Error('Post not found or unauthorized'); // 404 or 403
    }

    return this.prismaService.post.delete({
      where: { id },
    });
  }
}
