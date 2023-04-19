import {
  StyleSheet,
  View,
  Platform,
  KeyboardAvoidingView,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import EventSource, {
  EventSourceListener,
  EventSourceOptions,
} from 'react-native-sse';
import {SafeAreaView} from 'react-native-safe-area-context';
import React, {useContext} from 'react';

import {Margin, Color, Padding} from '../../GlobalStyles';
import {useEffect, useRef, useState} from 'react';

import TitleSection from '../components/TitleSection';
import QuickActions from '../components/QuickActions';
import QuestionBox from '../components/QuestionBox';
import AIMessage from '../components/AIMessage';
import UserMessage from '../components/UserMessage';

import AppContext from '../persist/AppContext';
import ArrowGuide from '../components/help/ArrowGuide';
import {useTts} from '../utils/useTts';

interface ChatCompletionChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Choice[];
}

interface Choice {
  delta?: {
    content?: string;
    role?: string;
  };
  index: number;
  finish_reason: 'stop' | 'length' | 'max_tokens' | null;
}

interface Message {
  _id: number;
  text: string;
  isLoading: boolean;
  isAI: boolean;
  veid: string;
  createdAt: Date;
  bypass: boolean;
}

const ShortCuts = () => {
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList>(null);

  const [q, setQ] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  const {company, setCompany} = useContext(AppContext);
  const [showArrow, setShowArrow] = useState(true);

  const {beginReading, endReading} = useTts({
    isEnabled: company.settings.tts,
  });

  const onQuestionBoxAvatarClick = () => {
    setShowArrow(false);
    const newcompany = {
      ...company,
      settings: {
        ...company.settings,
        guide: false,
      },
    };
    setCompany(newcompany);
    navigation.navigate('Employees' as never);
  };

  let currentEmployee = company.employees.find(e => e.id == company.curid);
  if (!currentEmployee) {
    const newcompany = {
      ...company,
      curid: company.employees[0].id,
    };
    setCompany(newcompany);
    currentEmployee = company.employees[0];
  }

  useEffect(() => {
    setShowArrow(company.settings.guide);
  }, [company]);

  const ask = (question: string) => {
    setQ('');
    let newContent = '';

    //Add the last message to the list
    const userMsg = {
      _id: new Date().getTime(),
      text: question,
      createdAt: new Date(),
      isLoading: false,
      isAI: false,
      veid: currentEmployee!.id,
      bypass: false,
    };

    setMessages(previousMessages => [...previousMessages, userMsg]);

    if (currentEmployee) {
      const url = company.config.API_URL + '/vc/v1/chat'; // replace with your API url

      // construct message history to send to the API
      let history = [
        {
          role: 'user',
          content: question,
        },
      ];

      for (
        let i = messages.length - 1;
        i >= 0 && i > messages.length - 4;
        i--
      ) {
        const msg = messages[i];
        if (msg.veid.startsWith('D') || msg.bypass) {
          // drawer
          continue;
        } else if (msg.isAI) {
          history = [
            {
              role: 'assistant',
              content: msg.text,
            },
            ...history,
          ];
        } else {
          history = [
            {
              role: 'user',
              content: msg.text,
            },
            ...history,
          ];
        }

        const msgTxt = JSON.stringify(history);
        console.log('msgTxt length: ', msgTxt.length);
        if (msgTxt.length > 512) {
          break;
        }
      }

      // Parameters to pass to the API
      const data = {
        version: 4,
        veid: currentEmployee.id,
        vename: currentEmployee.name,
        messages: history,
      };

      const options: EventSourceOptions = {
        method: 'POST', // Request method. Default: GET
        timeout: 30000, // Time after which the connection will expire without any activity: Default: 0 (no timeout)
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${company.jwt}`,
        }, // Your request headers. Default: {}
        body: JSON.stringify(data), // Your request body sent on connection: Default: undefined
        debug: true, // Show console.debug messages for debugging purpose. Default: false
        pollingInterval: 3600000, // Time (ms) between reconnections. Default: 5000
      };

      //Add the last message to the list
      const message = {
        _id: userMsg._id + 1,
        text: '',
        createdAt: new Date(),
        isLoading: true,
        isAI: true,
        veid: currentEmployee.id,
        bypass: currentEmployee.id.startsWith('D'),
      };
      setMessages(previousMessages => [...previousMessages, message]);

      //Initiate the requests
      const es = new EventSource(url, options);

      let reason = '';
      // Listen the server until the last piece of text
      const listener: EventSourceListener = event => {
        //console.log('SSE Event:', event);
        if (event.type === 'open') {
          console.log('Open SSE connection.');
        } else if (event.type === 'message') {
          if (event.data !== '[DONE]') {
            // get every piece of text
            const serverResponse: ChatCompletionChunk = JSON.parse(event.data!);
            const delta = serverResponse.choices[0].delta;

            // Check if is the last text to close the events request
            const finish_reason = serverResponse.choices[0].finish_reason;
            reason = finish_reason!;

            if (finish_reason != null) {
              if (reason != 'stop')
                newContent = newContent + ' [ends with ' + reason + ']';
              es.close();
            } else {
              if (delta && delta.content) {
                beginReading(delta.content);
                // Update content with new data
                newContent = newContent + delta.content;
              } else {
              }
              //setMessages([...message, newContent]);
            }

            // Continuously update the last message in the state
            // with new piece of data
            setMessages(previousMessages => {
              // Get the last array
              const last = [...previousMessages];

              // Update the list
              const mewLIst = last.map((m, _i) => {
                if (m._id === message._id) {
                  m.text = newContent;
                }
                return m;
              });
              // Return the new array
              return mewLIst;
            });
          } else {
            es.close();
            console.log('done. the answer is: ', newContent);
            endReading();
            setMessages(previousMessages => {
              // Get the last array
              const last = [...previousMessages];

              // Update the list
              const mewLIst = last.map((m, _i) => {
                if (m._id === message._id) m.isLoading = false;

                return m;
              });
              // Return the new array
              return mewLIst;
            });
          }
        } else if (event.type === 'error') {
          //console.error('Connection error from server:', event.message);
          reqErrorHandler(message._id, '对话服务器返回错误：' + event.message);
          es.close();
        } else if (event.type === 'exception') {
          //console.error('Error:', event.message, event.error);
          reqErrorHandler(message._id, '程序错误：' + event.message);
          es.close();
        }
      };

      // Add listener
      es.addEventListener('open', listener);
      es.addEventListener('message', listener);
      es.addEventListener('error', listener);

      return () => {
        es.removeEventListener('open', listener);
        es.removeEventListener('message', listener);
        es.removeEventListener('error', listener);
        es.close();
      };
    } else {
      console.error('请选择一个虚拟员工');
    }
  };

  // const endReading = (id: number, text: string) => {
  //   endReading();
  //   setMessages(previousMessages => {
  //     // Get the last array
  //     const last = [...previousMessages];

  //     // Update the list
  //     const mewLIst = last.map((m, i) => {
  //       if (m._id === id) {
  //         m.isLoading = false;
  //         m.text = text;
  //       }

  //       return m;
  //     });
  //     // Return the new array
  //     return mewLIst;
  //   });
  // };

  const reqErrorHandler = (msgid: number, txt: string) => {
    console.log('reqErrorHandler, msgid: ', msgid, ', txt: ', txt);

    let msgpadding =
    txt +
    ' \n\n(我们的系统目前正处于快速迭代升级中，出现错误很可能意味着您当前的App版本已经过时，请尝试点击这个链接升级到最新版本：https://vcorp.ai/ )';

    // check 401 error and retry
    if (txt.indexOf('401') > 0) {
      console.log('401 error, retrying...');     

      const newcompany = {
        ...company,
        jwt: null,
      };
      setCompany(newcompany);

      msgpadding = '正在重新登陆服务器。。。请稍侯再试一次。';
    }

    setMessages(previousMessages => {
      // Get the last array
      const last = [...previousMessages];

      // Update the list
      const mewLIst = last.map((m, _i) => {
        if (m._id === msgid) {
          m.isLoading = false;
          m.text = msgpadding;
          m.bypass = true;
        }

        return m;
      });
      // Return the new array
      return mewLIst;
    });
    endReading();
  };

  // useEffect(() => {
  //   if (scrollViewRef.current) {
  //     scrollViewRef.current.scrollToEnd({animated: true});
  //   }
  // }, [messages]);

  // const handleContentSizeChange = () => {
  //   console.log('handleContentSizeChange');
  //   scrollViewRef.current?.scrollToEnd({animated: true});
  // };
  // const handleLayout = () => {
  //   console.log('handleLayout');
  //   scrollViewRef.current?.scrollToEnd({animated: true});
  // };
  const handleStop = (msg: Message) => {
    reqErrorHandler(msg._id, msg.text);
  };

  const styles = StyleSheet.create({
    kav: {
      paddingBottom: Platform.OS === 'ios' ? 80 : 80,
      flex: 1,
    },
    frameScrollViewContent: {
      flexDirection: 'column',
      paddingHorizontal: 0,
      paddingVertical: 16,
    },
    mt8: {
      marginTop: Margin.m_sm,
    },
    shortcutsChild: {
      borderStyle: 'solid',
      borderColor: '#ececec',
      borderTopWidth: 1,
      width: 376,
      height: 1,
    },
    frameParent: {
      alignSelf: 'stretch',
      flex: 1,
      paddingHorizontal: Padding.p_sm,
    },
    shortcuts: {
      //borderRadius: Border.br_lg,
      backgroundColor: Color.white,
      width: '100%',
      overflow: 'hidden',
      //paddingHorizontal: Padding.p_sm,
      //paddingVertical: Padding.p_xl,
      //paddingBottom: Platform.OS === 'ios' ? 78 : 58,
      flex: 1,
    },
  });

  //behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'height' : 'height'}>
        <View style={styles.shortcuts}>
          {showArrow && <ArrowGuide />}
          <FlatList
            style={[styles.frameParent, styles.mt8]}
            data={messages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) =>
              item.isAI ? (
                <AIMessage
                  key={index}
                  text={item.text}
                  isLoading={item.isLoading}
                  msg={item}
                  onStop={handleStop}
                />
              ) : (
                <UserMessage key={index} text={item.text} />
              )
            }
            ListHeaderComponent={
              <>
                <TitleSection />
                <View style={[styles.shortcutsChild, styles.mt8]} />
                <QuickActions pressed={setQ} />
              </>
            }
            ListFooterComponent={<></>}
            contentContainerStyle={{flexGrow: 1, paddingBottom: 16}}
            keyboardShouldPersistTaps="handled"
            // onContentSizeChange={() => flatListRef?.current?.scrollToEnd()}
            ref={flatListRef}
          />
        </View>
      </KeyboardAvoidingView>
      <QuestionBox
        q={q}
        onVuesaxboldsendPress={ask}
        employee={currentEmployee}
        onAvatarPress={onQuestionBoxAvatarClick}
      />
    </View>
  );
};

export default ShortCuts;
