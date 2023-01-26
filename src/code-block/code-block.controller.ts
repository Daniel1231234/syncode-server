import { Controller, Get, Param } from '@nestjs/common';
import { CodeBlock } from './code-block.schema';
import { CodeBlockService } from './code-block.service';

@Controller('/api/block')
export class CodeBlockController {
  constructor(private readonly codeBlockService: CodeBlockService) {}

  @Get('/')
  async getBlocks(): Promise<CodeBlock[]> {
    const blocks = await this.codeBlockService.getAllBlocks();
      return blocks
  }

  @Get('/:blockId')
  async findOneBlock(@Param('blockId') blockId: string): Promise<CodeBlock> {
    const res = await this.codeBlockService.findOne(blockId)
    return res
  }
}
