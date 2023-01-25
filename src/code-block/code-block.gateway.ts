/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
} from '@nestjs/websockets';
import { CodeBlockService } from './code-block.service';
// import { CodeBlockDocument } from './code-block.schema';

@WebSocketGateway({
    cors: '*',
})

@Injectable()
export class CodeBlockGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(@InjectModel('codeblocks') private codeBlockService: CodeBlockService) { }

    @WebSocketServer()
    server = new Server
    joindUsers = 0
    currBlock: string
    currentTypingCode: string;
    isMentor: null | Socket
     private logger = new Logger('codeBlockGateway');


    handleConnection(client: Socket) {
        console.log(`user connected ${client.id}`)
        this.logger.log(`user connected ${client.id}`)
    }

    handleDisconnect(client: Socket) {
        console.log(`user disconnected ${client.id}`);
    }

    @SubscribeMessage('join_room')
    async handleRoomJoin(client: Socket, blockTitle: any) {
        try {
            if (this.joindUsers >= 2 && this.joindUsers < 0) return
            this.joindUsers++
            console.log(this.joindUsers, ' join room')
            this.currBlock = blockTitle
            client.join(this.currBlock)
            if (!this.isMentor) this.isMentor = client

            client.emit('joined_users', {
                joinedUsers: this.joindUsers,
            })

            this.server.to(this.currBlock).emit('joined_users', {
                joinedUsers: this.joindUsers
            })

        } catch (err) {
            console.log(err)
        }
    }




    


    @SubscribeMessage('update_code')
    handleUpdateCode(client: Socket, code: string) {
        try {
            if (client === this.isMentor) return
            this.currentTypingCode = code
            client.emit('code_updated', code)
            this.server.to(this.currBlock).emit('code_updated', code)
        } catch (err) {
            console.log(`${err} in update code event`)
        }
    }



    @SubscribeMessage('leave_room')
    async handleLeaveRoom(client: Socket, blockTitle: any) {
        try {
            // if (blockTitle !== this.currBlock) return
            if (this.joindUsers === 2) {
                this.joindUsers = 1
            } else if (this.joindUsers === 1) {
                this.joindUsers = 0
            } 
            console.log(this.joindUsers, ' leave room')
            if (client === this.isMentor) this.isMentor = null

            client.to(blockTitle).emit('joined_users', {
                joinedUsers: this.joindUsers
            })

            client.leave(this.currBlock)
            this.currBlock = ""
        } catch (err) {
            console.log(err)
        }
    }


}
