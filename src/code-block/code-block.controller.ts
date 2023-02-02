import { Controller, Get, Param } from '@nestjs/common';
import { CodeBlock } from './code-block.schema';
import { CodeBlockService } from './code-block.service';

@Controller('/api/block')
export class CodeBlockController {
  constructor(private readonly codeBlockService: CodeBlockService) { }

  @Get('/')
  async getBlocks(): Promise<CodeBlock[]> {
    return await this.codeBlockService.getAllBlocks();
  }

  @Get('/:blockId')
  async findOneBlock(@Param('blockId') blockId: string): Promise<CodeBlock> {
    return await this.codeBlockService.findOne(blockId)
  }


}
