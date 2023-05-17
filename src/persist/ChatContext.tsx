import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import ChatClient from '../comm/chatClient';
import {Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Company} from './slices/company';

interface IChatContext {
  chatClient: ChatClient;
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
      chatClientInstance.updateJwt(apiUrl, jwt);
    }
    return chatClientInstance;
  };
})();

const ChatProvider: React.FC<ChatProviderProps> = ({children}) => {
  const dispatch = useDispatch();
  const company = useSelector((state: any) => state.company) as Company;
  const [isLoaded, setIsLoaded] = useState(false);
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState,
  );

  // 创建ChatClient实例
  const chatClient = useRef(
    createChatClientInstance(company!.config.API_URL, company!.jwt!),
  );

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground!');
        // App has come to the foreground, you might want to re-establish the connection
        chatClient.current.reconnect();
      } else if (nextAppState.match(/inactive|background/)) {
        console.log('App has gone to the background!');
        // App has gone to the background, you might want to disconnect the connection
        chatClient.current.disconnect();
      }
      setAppState(nextAppState);
    };

    const appStateSubscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      appStateSubscription.remove();
    };
  }, [appState]);

  useEffect(() => {
    //console.log('ChatProvider: useEffect');
    if (company === null) {
      console.log('ChatProvider: useEffect: company is null');
      return;
    } else {
      // console.log(
      //   'ChatProvider: useEffect: company is not null: ',
      //   company.jwt,
      // );
    }

    chatClient.current.updateJwt(company.config.API_URL, company!.jwt!);
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
    chatClient: chatClient.current,
  };

  return (
    <ChatContext.Provider value={chatContextValue}>
      {isLoaded ? children : <Text>Company is null. Unable to continue.</Text>}
    </ChatContext.Provider>
  );
};
