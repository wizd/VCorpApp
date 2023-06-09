import {io, Socket} from 'socket.io-client';
import {VwsMessage} from './wsproto';

type VwsEventCallback = (message: VwsMessage) => void;

// 聊天客户端类
class ChatClient {
  private jwt: string;
  private serverUrl: string;
  private socket: Socket;

  private dispatch: (action: {type: string; payload?: any}) => void;

  private autoReconnectInterval: number = 5000; // 设置自动重连时间间隔，单位：毫秒

  // events
  private events: {[eventName: string]: VwsEventCallback[]} = {};

  on(eventName: string, listener: VwsEventCallback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(listener);
  }

  off(eventName: string, listener: VwsEventCallback) {
    if (!this.events[eventName]) {
      return;
    }
    this.events[eventName] = this.events[eventName].filter(l => l !== listener);
  }

  emit(eventName: string, message: VwsMessage) {
    if (!this.events[eventName]) {
      return;
    }
    this.events[eventName].forEach(listener => listener(message));
  }

  handleNewMessage = async (message: VwsMessage) => {
    //console.log('Received chat message from server:', message);
    this.emit('message', message);

    // 使用类型断言来解决类型错误
    (this.socket.auth as {[key: string]: any}).offset = message.seq;
  };

  handleDisconnect = () => {
    this.dispatch({type: 'chat/disconnected'});
    setTimeout(() => {
      this.socket.connect();
    }, this.autoReconnectInterval);
  };

  handleConnect = () => {
    this.dispatch({type: 'chat/connected'});
  };

  constructor(
    serverUrl: string,
    token: string,
    dispatch: (action: {type: string; payload?: any}) => void,
  ) {
    this.jwt = token;
    this.serverUrl = serverUrl;
    this.dispatch = dispatch;
    if (this.jwt === undefined || this.serverUrl === undefined) {
      throw new Error('JWT and server URL must be provided.');
    }

    console.log('create websocket in updateJwt: ', this.serverUrl, this.jwt);
    this.socket = io(this.serverUrl, {
      auth: {
        offset: undefined,
      },
      query: {jwt: this.jwt},
      reconnectionDelayMax: 8000, // 最大重连延迟时间，单位为毫秒
      timeout: 14000, // 连接超时时间，单位为毫秒
    });

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

  public reconnect(): void {
    console.log('reconnect websocket: ', this.serverUrl, this.jwt);
    this.socket.connect();
  }

  public isConnected = (): boolean => this.socket.connected;

  // 更新JWT并重新连接
  updateJwt(serverUrl: string, jwt: string) {
    if (serverUrl === undefined || jwt === undefined || this.jwt === jwt) {
      return;
    }
    this.serverUrl = serverUrl;
    this.jwt = jwt;
    this.socket?.disconnect();

    // 创建新的Socket
    console.log('create websocket in updateJwt: ', this.serverUrl, this.jwt);
    this.socket = io(this.serverUrl, {
      auth: {
        offset: undefined,
      },
      query: {jwt: this.jwt},
      reconnectionDelayMax: 8000, // 最大重连延迟时间，单位为毫秒
      timeout: 14000, // 连接超时时间，单位为毫秒
    });

    this.socket.on('smsg', this.handleNewMessage);
    this.socket.on('disconnect', this.handleDisconnect);
    this.socket.on('connect', this.handleConnect);
  }
}

export default ChatClient;
