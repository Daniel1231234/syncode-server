import { CodeBlockService } from './code-block.service';
import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
} from '@nestjs/websockets';

@WebSocketGateway({
    namespace: '/codeblock',
    cors: '*',
})

@Injectable()
export class CodeBlockGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private codeBlockService: CodeBlockService) { }

    @WebSocketServer()
    server: Server
    joindUsers = 0
    currBlock: string
    currentTypingCode: string;
    isMentor: null | Socket
    rooms:[]
    private logger = new Logger('codeBlockGateway');


   async handleConnection(client: Socket) {
        this.logger.log(`user connected ${client.id}`)
    }

    async handleDisconnect(client: Socket) {
       this.logger.log(`user disconnected ${client.id}`);
    }

    @SubscribeMessage('join_room')
    async handleRoomJoin(client: Socket, blockTitle: string) {
        try {
            const room = await this.codeBlockService.addUserToRoom(blockTitle, client.id)
            client.join(room.title)

            client.emit('joined_users', room.users)
            this.server.to(room.title).emit('joined_users', room.users)

        } catch (err) {
            this.logger.error(`${err} in handleRoomJoin`)
            throw err
        }
    }

    @SubscribeMessage('update_code')
    handleUpdateCode(client: Socket, data:any) {
        try {
            const {updatedCode, currBlock} = data
            this.currentTypingCode = updatedCode
            client.emit('code_updated', updatedCode)
            this.server.to(currBlock.title).emit('code_updated', updatedCode)
        } catch (err) {
            this.logger.error(`${err} in handleUpdateCode`)
            throw err
        }
    }


    @SubscribeMessage('leave_room')
    async handleLeaveRoom(client: Socket, blockTitle: any) {
        try {
            const room = await this.codeBlockService.removeUserFromRoom(blockTitle, client.id)
            client.emit('joined_users', room.users)
            this.server.emit('joined_users', room.users)
            client.leave(room.title)
        } catch (err) {
            this.logger.error(`${err} in handleLeaveRoom`)
            throw err
        }
    }


}
