/* eslint-disable prettier/prettier */
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CodeBlock } from './code-block.schema';
import * as mongoose from 'mongoose'

export class CodeBlockService {
  constructor(
    @InjectModel('codeblocks')
    private readonly codeBlockModel: Model<CodeBlock>,
  ) { }

  async getAllBlocks(): Promise<CodeBlock[]> {
    return await this.codeBlockModel.find().exec();
  }

  async findOne(blockId: string): Promise<CodeBlock> {
    const id = new mongoose.Types.ObjectId(blockId)
    const codeBlock = await this.codeBlockModel.findOne({ _id: id }).exec();
    return codeBlock
  }
}
