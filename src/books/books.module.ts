import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { BooksSchema } from './schemas/books.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'books', schema: BooksSchema }]),
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
