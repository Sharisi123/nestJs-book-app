import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NewBookDto } from './books.dto';
import { BooksDocument } from './schemas/books.schema';

@Injectable()
export class BooksService {
  constructor(@InjectModel('books') private booksModel: Model<BooksDocument>) {}

  async getBooks(): Promise<BooksDocument[]> {
    try {
      const result = await this.booksModel.find().sort({ updatedAt: -1 });
      console.log(result);
      if (result) {
        return result;
      } else {
        throw new NotFoundException({
          error: 'not found any books in db',
        });
      }
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async getBooksById(_id: string): Promise<BooksDocument> {
    try {
      const result = await this.booksModel.findById({ _id });
      if (result) {
        return result;
      }
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async setBook(newBookData: NewBookDto): Promise<string> {
    try {
      const result = await this.booksModel.create({
        newBookData,
      });
      if (result) {
        return 'new book added';
      }
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async deleteBook(_id: string): Promise<string> {
    try {
      await this.booksModel.findByIdAndDelete({ _id });
      return 'user was deleted';
    } catch (err) {
      throw new NotFoundException();
    }
  }
}
