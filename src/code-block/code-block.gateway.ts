import { CodeBlockService } from './code-block.service';
import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import {
    WebSocketGateway,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway({ namespace: '/' })

@Injectable()
export class CodeBlockGateway
    implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private codeBlockService: CodeBlockService) { }

    @WebSocketServer()
    server: Server;
    private logger = new Logger('codeBlockGateway');

    handleConnection(client: Socket) {
        this.logger.log(`user connected ${client.id}`)

        client.on('join_room', async (blockTitle: string) => {
            const updatedBlock = await this.codeBlockService.updateBlockWithUsers(blockTitle, client.id, 'add')
            client.join(blockTitle)
            client.emit('joined_users', updatedBlock.users);
            this.logger.log(`Client joined room: ${blockTitle}`);
            this.server.to(blockTitle).emit('joined_users', updatedBlock.users);
        })

        client.on('update_code', (data) => {
            const { currBlock, updatedCode } = data
            this.server.to(currBlock).emit('code_updated', updatedCode)
        })

        client.on('leave_room', async (blockTitle: string) => {
            const updatedBlock = await this.codeBlockService.updateBlockWithUsers(blockTitle, client.id, 'remove')
            this.logger.log(`Client leave room: ${blockTitle}`);
            client.emit('joined_users', updatedBlock.users);
            this.server.to(blockTitle).emit('joined_users', updatedBlock.users);
            client.leave(blockTitle)
        })

    }

    handleDisconnect(client: Socket) {
        this.logger.log(`user disconnect ${client.id}`)
    }

    // debuging methods
    async _getAllSockets() {
        const sockets = await this.server.fetchSockets()
        return sockets
    }

    async _printSockets() {
        const sockets = await this._getAllSockets()
        sockets.forEach(this._printSocket)
    }

    _printSocket(socket: any) {
        console.log(`Socket - socketId: ${socket.id}`)
    }


}
