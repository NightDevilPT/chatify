import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatSocketService } from './chat-socket.service';
import { LoggerService } from 'src/services/logger-service/index.service';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: '*', // Allow all origins (adjust for production)
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class ChatSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  connectedUser = new Map<string, any>();

  constructor(
    private readonly chatSocketService: ChatSocketService,
    private readonly loggerService: LoggerService,
  ) {}

  afterInit(server: Server) {
    this.loggerService.log(`Chat socket server running: ws://localhost:${process.env.PORT ?? 5000}/chat`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.loggerService.log(`Client connected: ${client.id}`);
    this.connectedUser.set(client.id, client);
  }

  handleDisconnect(client: Socket) {
    this.loggerService.log(`Client disconnected: ${client.id}`);
    this.connectedUser.delete(client.id);
  }

  @SubscribeMessage('healthCheck')
  handleEvent(@MessageBody() data: string): any {
    this.loggerService.log(`Health check received: ${JSON.stringify(data)}`);
    return { event: "healthCheck", data }; // Explicit response format
  }
}
