import React, {createContext, useContext, useEffect, useState} from 'react';
import ChatClient, {MessageCallback, ChatMessage} from '../comm/chatClient';
import {Text} from 'react-native';
import {API_URL_DEFAULT} from './AppContext';

export interface IChatContext {
  sendMessage: (message: ChatMessage) => void;
  onNewMessage: (callback: MessageCallback) => void;
  offNewMessage: (callback: MessageCallback) => void;
}

const ChatContext = createContext<IChatContext | null>(null);

const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: React.ReactNode;
}

const ChatProvider: React.FC<ChatProviderProps> = ({children}) => {
  const [chatClient, setChatClient] = useState<ChatClient | null>(null);

  useEffect(() => {
    console.log('ChatProvider: useEffect');
    const client = new ChatClient(API_URL_DEFAULT);
    setChatClient(client);

    return () => {
      client.disconnect();
    };
  }, []);

  if (!chatClient) {
    return <Text>Loading...</Text>;
  }

  const chatContextValue: IChatContext = {
    sendMessage: chatClient.sendChatMessage.bind(chatClient),
    onNewMessage: chatClient.onNewMessage.bind(chatClient),
    offNewMessage: chatClient.offNewMessage.bind(chatClient),
  };

  return (
    <ChatContext.Provider value={chatContextValue}>
      {children}
    </ChatContext.Provider>
  );
};

export {ChatProvider, useChat};
