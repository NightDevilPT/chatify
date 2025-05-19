import { WebSocketGateway } from '@nestjs/websockets';
import { ChatSocketService } from './chat-socket.service';

@WebSocketGateway()
export class ChatSocketGateway {
  constructor(private readonly chatSocketService: ChatSocketService) {}
}
