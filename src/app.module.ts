import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ChatsModule } from './chats/chats.module';
import { ChatsGateway } from './chats/chats.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    BooksModule,
    UsersModule,
    MongooseModule.forRoot(process.env.MONGODB_CONNECTION_STRING),
    AuthModule,
    ChatsModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatsGateway],
})
export class AppModule {}
