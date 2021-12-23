import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BooksDocument = Books & Document;

@Schema({ timestamps: true })
export class Books {
  @Prop({
    type: String,
    required: true,
  })
  _id: string;

  @Prop({
    type: String,
    required: true,
  })
  img: string;

  @Prop({
    type: String,
    required: true,
  })
  title: string;

  @Prop({
    type: String,
    required: true,
  })
  content: string;

  @Prop({
    type: String,
    required: true,
  })
  realizeDate: string;

  @Prop({
    type: String,
    required: true,
  })
  authorId: string;
}

export const BooksSchema = SchemaFactory.createForClass(Books);
