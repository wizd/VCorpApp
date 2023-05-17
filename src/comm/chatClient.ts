import {io, Socket} from 'socket.io-client';
import {VwsMessage} from './wsproto';

// 定义异步回调类型
export type MessageCallback = (message: VwsMessage) => void | Promise<void>;
export type ConnectionStatusCallback = (status: boolean) => void;

// 聊天客户端类
class ChatClient {
  private jwt?: string;
  private serverUrl?: string;
  private socket: Socket;
  private messageSubscribers: Set<MessageCallback> = new Set();
  private autoReconnectInterval: number = 1000; // 设置自动重连时间间隔，单位：毫秒

  private connectionStatusSubscribers: Set<ConnectionStatusCallback> =
    new Set();

  onConnectionStatusChange(callback: ConnectionStatusCallback): void {
    this.connectionStatusSubscribers.add(callback);
  }

  offConnectionStatusChange(callback: ConnectionStatusCallback): void {
    this.connectionStatusSubscribers.delete(callback);
  }

  onNewMessage(callback: MessageCallback): void {
    this.messageSubscribers.add(callback);
  }

  offNewMessage(callback: MessageCallback): void {
    this.messageSubscribers.delete(callback);
  }

  handleNewMessage = async (message: VwsMessage) => {
    console.log('Received chat message from server:', message);
    for (const subscriber of this.messageSubscribers) {
      subscriber(message);
    }
  };

  handleDisconnect = () => {
    console.log('Disconnected from chat server. Attempting to reconnect...');
    for (const subscriber of this.connectionStatusSubscribers) {
      console.log('notify subscriber ws disconnect:', subscriber);
      subscriber(false);
    }
    setTimeout(() => {
      this.socket.connect();
    }, this.autoReconnectInterval);
  };

  handleConnect = () => {
    console.log('Connected to chat server: ', this.serverUrl);
    for (const subscriber of this.connectionStatusSubscribers) {
      console.log('notify subscriber ws connected:', subscriber);
      subscriber(true);
    }
  };

  constructor(serverUrl?: string, token?: string) {
    this.jwt = token;
    this.serverUrl = serverUrl;
    if (this.jwt === undefined || this.serverUrl === undefined) {
      throw new Error('JWT and server URL must be provided.');
    }
    this.socket = io(serverUrl!, {query: {jwt: this.jwt}});

    // 绑定事件处理器
    this.socket.on('smsg', this.handleNewMessage);
    this.socket.on('disconnect', this.handleDisconnect);
    this.socket.on('connect', this.handleConnect);
  }

  // 向服务器发送聊天消息
  public sendChatMessage(message: VwsMessage): void {
    this.socket.emit('cmsg', message);
  }

  // 断开与服务器的连接
  public disconnect(): void {
    this.socket.disconnect();
  }

  // 更新JWT并重新连接
  updateJwt(serverUrl?: string, jwt?: string) {
    if (serverUrl === undefined || jwt === undefined || this.jwt === jwt) {
      return;
    }
    this.serverUrl = serverUrl;
    this.jwt = jwt;
    this.socket.disconnect();

    // 创建新的Socket
    this.socket = io(this.serverUrl, {query: {jwt: this.jwt}});

    // 重新绑定事件处理器
    this.socket.on('smsg', this.handleNewMessage);
    this.socket.on('disconnect', this.handleDisconnect);
    this.socket.on('connect', this.handleConnect);

    // 通知所有订阅者连接状态已改变
    for (const subscriber of this.connectionStatusSubscribers) {
      subscriber(false);
    }
  }
}

export default ChatClient;
