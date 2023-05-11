import React, {createContext, useContext, useEffect, useState} from 'react';
import ChatClient, {MessageCallback} from '../comm/chatClient';
import {Text} from 'react-native';
import AppContext, {API_URL_DEFAULT} from './AppContext';
import {VwsMessage} from '../comm/wsproto';

export interface IChatContext {
  sendMessage: (message: VwsMessage) => void;
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
  const {company} = useContext(AppContext);
  const [chatClient, setChatClient] = useState<ChatClient | null>(null);

  useEffect(() => {
    console.log('ChatProvider: useEffect');
    if (company === null) {
      console.log('ChatProvider: useEffect: company is null');
      return;
    } else {
      console.log(
        'ChatProvider: useEffect: company is not null: ',
        company.jwt,
      );
    }
    if (chatClient) {
      chatClient.disconnect();
    }

    const client = new ChatClient(API_URL_DEFAULT, company?.jwt!);
    setChatClient(client);

    return () => {
      client.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company]);

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
