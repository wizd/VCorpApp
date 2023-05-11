export type VwsMessageType = 'text' | 'image' | 'blob' | 'system';

export interface VwsBaseMessage {
  id: string; // 唯一消息 ID
  t: VwsMessageType; // 消息类型
  sid: string; // 发送者 ID
  ts: number; // 时间戳
}

export interface VwsTextMessage extends VwsBaseMessage {
  t: 'text';
  c: string; // 文本内容
  cid?: string; // 补充文本的消息 ID（可选）
  final?: boolean; // 补充消息是否完结（可选）
}

export interface VwsImageMessage extends VwsBaseMessage {
  t: 'image';
  url: string; // 图片 URL
}

export interface VwsBlobMessage extends VwsBaseMessage {
  t: 'blob';
  data: ArrayBuffer; // Blob 数据
}

export interface VwsSystemMessage extends VwsBaseMessage {
  t: 'system';
  n: string; // 通知内容
}

export type VwsMessage =
  | VwsTextMessage
  | VwsImageMessage
  | VwsBlobMessage
  | VwsSystemMessage;
