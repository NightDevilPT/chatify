import { Module } from '@nestjs/common';
import { ChatSocketService } from './chat-socket.service';
import { ChatSocketGateway } from './chat-socket.gateway';
import { LoggerService } from 'src/services/logger-service/index.service';

@Module({
  providers: [ChatSocketGateway, ChatSocketService, LoggerService],
})
export class ChatSocketModule {}
