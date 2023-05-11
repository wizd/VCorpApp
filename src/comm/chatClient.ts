import {io, Socket} from 'socket.io-client';

// 定义聊天消息类型
interface ChatMessage {
  sender: string;
  content: string;
  timestamp: string;
}

// 定义异步回调类型
type ChatMessageCallback = (message: ChatMessage) => Promise<void>;

// 聊天客户端类
class ChatClient {
  private socket: Socket;
  private messageCallback?: ChatMessageCallback;

  constructor(
    serverUrl: string,
    messageCallback?: ChatMessageCallback, // 添加回调参数
  ) {
    this.socket = io(serverUrl);
    this.messageCallback = messageCallback;

    // 客户端监听服务器发来的聊天消息
    this.socket.on('chatMessage', async (message: ChatMessage) => {
      console.log('Received chat message from server:', message);
      // 调用回调函数（如果已提供）
      if (this.messageCallback) {
        await this.messageCallback(message);
      }
    });
  }

  // 向服务器发送聊天消息
  public sendChatMessage(message: ChatMessage): void {
    this.socket.emit('chatMessage', message);
  }

  // 断开与服务器的连接
  public disconnect(): void {
    this.socket.disconnect();
  }
}

export default ChatClient;
