import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import ChatClient, {
  ConnectionStatusCallback,
  MessageCallback,
} from '../comm/chatClient';
import {Text} from 'react-native';
import AppContext from './AppContext';
import {VwsMessage} from '../comm/wsproto';

export interface IChatContext {
  sendMessage: (message: VwsMessage) => void;
  onNewMessage: (callback: MessageCallback) => void;
  offNewMessage: (callback: MessageCallback) => void;
  onConnectionStatusChange: (callback: ConnectionStatusCallback) => void;
  offConnectionStatusChange: (callback: ConnectionStatusCallback) => void;
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

const createChatClientInstance = (() => {
  let chatClientInstance: ChatClient | null = null;

  return (apiUrl?: string, jwt?: string) => {
    if (!chatClientInstance) {
      chatClientInstance = new ChatClient(apiUrl, jwt);
    } else {
      chatClientInstance.updateJwt(apiUrl, jwt);
    }
    return chatClientInstance;
  };
})();

const ChatProvider: React.FC<ChatProviderProps> = ({children}) => {
  const {company} = useContext(AppContext);
  const [isLoaded, setIsLoaded] = useState(false);

  // 创建ChatClient实例
  const chatClient = useRef(
    createChatClientInstance(company!.config.API_URL, company!.jwt),
  );

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

    chatClient.current.updateJwt(company.config.API_URL, company.jwt);
    setIsLoaded(true);

    // 使用局部变量保存chatClient.current
    const currentChatClient = chatClient.current;

    return () => {
      // 使用局部变量
      currentChatClient.disconnect();
    };
  }, [company]);

  if (!isLoaded) {
    return <Text>Loading...</Text>;
  }

  const chatContextValue: IChatContext = {
    sendMessage: chatClient.current.sendChatMessage.bind(chatClient.current),
    onNewMessage: chatClient.current.onNewMessage.bind(chatClient.current),
    offNewMessage: chatClient.current.offNewMessage.bind(chatClient.current),
    onConnectionStatusChange: chatClient.current.onConnectionStatusChange.bind(
      chatClient.current,
    ),
    offConnectionStatusChange:
      chatClient.current.offConnectionStatusChange.bind(chatClient.current),
  };

  return (
    <ChatContext.Provider value={chatContextValue}>
      {children}
    </ChatContext.Provider>
  );
};

export {ChatProvider, useChat};
