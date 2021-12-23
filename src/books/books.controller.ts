import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Public } from 'src/_helpers/PublicRoute';
import { NewBookDto } from './books.dto';
import { BooksService } from './books.service';
import { BooksDocument } from './schemas/books.schema';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  // @Public()
  @Get()
  async getBooks(): Promise<BooksDocument[]> {
    return this.booksService.getBooks();
  }

  @Get(':id')
  async getBooksById(@Param('id') id: string): Promise<BooksDocument> {
    return this.booksService.getBooksById(id);
  }

  @Public()
  @Post()
  async setBook(@Body() newBookData: NewBookDto): Promise<string> {
    return this.booksService.setBook(newBookData);
  }

  @Post(':id')
  async deleteBook(@Param('id') id: string): Promise<string> {
    return this.booksService.deleteBook(id);
  }
}
