import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { CalsModule } from './cals/cals.module';

@Module({
  imports: [UsersModule, PrismaModule, AuthModule, PostsModule, CalsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
