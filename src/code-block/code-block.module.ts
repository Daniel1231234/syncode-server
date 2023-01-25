import { Module } from '@nestjs/common';
import { CodeBlockService } from './code-block.service';
import { CodeBlockController } from './code-block.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CodeBlockSchema } from './code-block.schema';
import { CodeBlockGateway } from './code-block.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'codeblocks', schema: CodeBlockSchema },
    ]),
  ],
  providers: [CodeBlockService, CodeBlockGateway],
  controllers: [CodeBlockController],
})
export class CodeBlockModule {}
