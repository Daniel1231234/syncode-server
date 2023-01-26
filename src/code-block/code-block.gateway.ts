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
            // Emit event to the joined user with the list of users in the room
            client.emit('joined_users', room.users)
            // Emit event to all users in the room with the list of users in the room
            this.server.to(room.title).emit('joined_users', room.users)

        } catch (err) {
            this.logger.error(`${err} in handleRoomJoin`)
            throw err
        }
    }

    @SubscribeMessage('update_code')
    handleUpdateCode(client: Socket, data: any) {
        try {
            const { updatedCode, currBlock } = data
            //Emit the 'code_updated' event to the mentor, who is in the same room as the student
            client.emit('code_updated', updatedCode)
            this.server.to(currBlock.title).emit('code_updated', updatedCode)
        } catch (err) {
            this.logger.error(`${err} in handleUpdateCode`)
            throw err
        }
    }


    @SubscribeMessage('leave_room')
    async handleLeaveRoom(client: Socket, blockTitle: string) {
        try {
            const room = await this.codeBlockService.removeUserFromRoom(blockTitle, client.id)
           //emit the event 'joined_users' to the current user with the updated list of users in the room
            client.emit('joined_users', room.users)
            //emit the event 'joined_users' to all the users in the room with the updated list of users
            this.server.emit('joined_users', room.users)
            client.leave(room.title)
        } catch (err) {
            this.logger.error(`${err} in handleLeaveRoom`)
            throw err
        }
    }


}
