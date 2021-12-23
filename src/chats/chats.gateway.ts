import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway(4200)
export class ChatsGateway {
  @WebSocketServer()
  server;

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    console.log('client', client);
    console.log('payload', payload);
    this.server.emit('hello');
    return 'Hello world!';
  }
}
