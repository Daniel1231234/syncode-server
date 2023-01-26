import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose'

export type CodeBlockDocument = CodeBlock & Document;

@Schema()
export class CodeBlock {
  @Prop(new mongoose.Types.ObjectId())
  _id: string;

  @Prop()
  title:string

  @Prop()
  problem:string

  @Prop()
  code: string;

  @Prop()
  solution: string;

  @Prop()
  users?: string[];


}

export const CodeBlockSchema = SchemaFactory.createForClass(CodeBlock);