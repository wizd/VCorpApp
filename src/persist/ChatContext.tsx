import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import ChatClient, {MessageCallback} from '../comm/chatClient';
import {Text} from 'react-native';
import AppContext from './AppContext';
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

const createChatClientInstance = (() => {
  let chatClientInstance: ChatClient | null = null;

  return (apiUrl: string, jwt: string) => {
    if (!chatClientInstance) {
      chatClientInstance = new ChatClient(apiUrl, jwt);
    } else {
      chatClientInstance.updateJwt(jwt);
    }
    return chatClientInstance;
  };
})();

const ChatProvider: React.FC<ChatProviderProps> = ({children}) => {
  const {company} = useContext(AppContext);
  const chatClientRef = useRef<ChatClient | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

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

    if (chatClientRef.current) {
      chatClientRef.current.disconnect();
    }

    console.log('createChatClientInstance use url: ', company.config.API_URL);
    const client = createChatClientInstance(
      company.config.API_URL,
      company.jwt,
    );
    chatClientRef.current = client;
    setIsLoaded(true);

    return () => {
      client.disconnect();
    };
  }, [company]);

  if (!isLoaded) {
    return <Text>Loading...</Text>;
  }

  const chatContextValue: IChatContext = {
    sendMessage: chatClientRef.current!.sendChatMessage.bind(
      chatClientRef.current,
    ),
    onNewMessage: chatClientRef.current!.onNewMessage.bind(
      chatClientRef.current,
    ),
    offNewMessage: chatClientRef.current!.offNewMessage.bind(
      chatClientRef.current,
    ),
  };

  return (
    <ChatContext.Provider value={chatContextValue}>
      {children}
    </ChatContext.Provider>
  );
};

export {ChatProvider, useChat};
