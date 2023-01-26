import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CodeBlock } from './code-block.schema';
import * as mongoose from 'mongoose'
import { UnauthorizedException } from "@nestjs/common";

export class CodeBlockService {
  constructor(
    @InjectModel('codeblocks')
    private readonly codeBlockModel: Model<CodeBlock>,
  ) { }

  async getAllBlocks(): Promise<CodeBlock[]> {
    try {
      return await this.codeBlockModel.find().exec();
    } catch (err) {
      throw new UnauthorizedException('Can not get Blocks')
    }
  }

  async addUserToRoom(blockTitle: string, socketId: string): Promise<any> {
    const block = await this.codeBlockModel.findOne({ title: blockTitle });
    if (!block) {
        throw new Error(`Block with title ${blockTitle} not found`);
    }
    if (block.users.indexOf(socketId) !== -1) {
      throw new Error(`user ${blockTitle} is allready in room`);
    }
    block.users.push(socketId);
    await block.save();
    return block
  }

  async removeUserFromRoom(blockTitle: string, socketId: string): Promise<any> {
    const block = await this.codeBlockModel.findOne({ title: blockTitle });
    if (!block) {
        throw new Error(`Block with title ${blockTitle} not found`);
    }

    block.users = block.users.filter(id => id !== socketId);
    await block.save();
    return block
  }


  async findOne(blockId: string): Promise<CodeBlock> {
    try {
      const id = new mongoose.Types.ObjectId(blockId)
      const codeBlock = await this.codeBlockModel.findOne({ _id: id }).exec();
      return codeBlock
    } catch (err) {
      throw new UnauthorizedException('Can not find Block')
    }
  }
}
