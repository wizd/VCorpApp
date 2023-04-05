import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import EventSource, {
  EventSourceListener,
  EventSourceOptions,
} from 'react-native-sse';
import React, {useContext} from 'react';

import {Margin, Border, Color, Padding} from '../../GlobalStyles';
import {useCallback, useEffect, useRef, useState} from 'react';

import TitleSection from '../components/TitleSection';
import QuickActions from '../components/QuickActions';
import QuestionBox from '../components/QuestionBox';
import AIMessage from '../components/AIMessage';
import UserMessage from '../components/UserMessage';

import AppContext, {Company} from '../persist/AppContext';
import {TextToSpeech} from '../utils/TextToSpeech';
import {LyraCrypto} from '../crypto/lyra-crypto';
import axios from 'axios';
import ArrowGuide from '../components/help/ArrowGuide';

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

const systemPrompt = '';
const assistantPrompt = '';

interface Message {
  _id: number;
  text: string;
  isLoading: boolean;
  isAI: boolean;
  veid: string;
  createdAt: Date;
}

const ShortCuts = () => {
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);
  const flatListRef = useRef<FlatList>(null);
  const [jwt, setJwt] = useState<string>('');

  const [q, setQ] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  const [tts] = useState(() => new TextToSpeech(10));

  const {company, setCompany} = useContext(AppContext);

  const [showArrow, setShowArrow] = useState(true);

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

  if (!company) {
    return null;
  }

  let currentEmployee = company.employees.find(e => e.id == company.curid);
  if (!currentEmployee) {
    const newcompany = {
      ...company,
      curid: company.employees[0].id,
    };
    setCompany(newcompany);
    currentEmployee = company.employees[0];
  }

  const beginReading = (txt: string) => {
    if (company.settings?.tts) {
      tts.emitTextGen(txt);
    }
  };

  const textFinished = () => {
    tts.emitTextEnd();
  };

  const register = (co: any) => {
    console.log('registering my company: ', co);
    const baseUrl = co.config.API_URL + '/vc/v1/user';
    const usr = {
      accountId: LyraCrypto.GetAccountIdFromPrivateKey(co.privatekey),
    };
    const data = {
      user: usr,
      signature: LyraCrypto.Sign(JSON.stringify(usr), co.privatekey),
    };
    const api = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    api.post('/register', data).then(ret => {
      console.log('register result: ', ret.data);
      if (ret.data.success) {
        setJwt(ret.data.data.token);
      }
    });
  };

  useEffect(() => {
    // if (company) register(company);
    // else console.log('company is null');
    setShowArrow(company.settings?.guide ?? true);
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
        i >= 0 && i > messages.length - 6;
        i--
      ) {
        const msg = messages[i];
        if (msg.veid.startsWith('D')) {
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
        version: 3,
        veid: currentEmployee.id,
        vename: currentEmployee.name,
        messages: history,
      };

      const options: EventSourceOptions = {
        method: 'POST', // Request method. Default: GET
        //timeout: 0, // Time after which the connection will expire without any activity: Default: 0 (no timeout)
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer aaaaaa`, //${jwt}`,
        }, // Your request headers. Default: {}
        body: JSON.stringify(data), // Your request body sent on connection: Default: undefined
        debug: true, // Show console.debug messages for debugging purpose. Default: false
        pollingInterval: 5000, // Time (ms) between reconnections. Default: 5000
      };

      //Add the last message to the list
      const message = {
        _id: userMsg._id + 1,
        text: '',
        createdAt: new Date(),
        isLoading: true,
        isAI: true,
        veid: currentEmployee.id,
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
              const mewLIst = last.map((m, i) => {
                if (m._id === message._id) m.text = newContent;
                return m;
              });
              // Return the new array
              return mewLIst;
            });
          } else {
            es.close();
            console.log('done. the answer is: ', newContent);
            textFinished();
            setMessages(previousMessages => {
              // Get the last array
              const last = [...previousMessages];

              // Update the list
              const mewLIst = last.map((m, i) => {
                if (m._id === message._id) m.isLoading = false;

                return m;
              });
              // Return the new array
              return mewLIst;
            });
          }
        } else if (event.type === 'error') {
          console.error('Connection error:', event.message);
          es.close();

          reqErrorHandler(message._id, newContent);
        } else if (event.type === 'exception') {
          console.error('Error:', event.message, event.error);
          es.close();

          reqErrorHandler(message._id, newContent);
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

  const reqErrorHandler = (msgid: number, txt: string) => {
    console.log('reqErrorHandler, msgid: ', msgid, ', txt: ', txt);
    textFinished();
    setMessages(previousMessages => {
      // Get the last array
      const last = [...previousMessages];

      // Update the list
      const mewLIst = last.map((m, i) => {
        if (m._id === msgid) {
          m.isLoading = false;
          m.text = txt;
        }

        return m;
      });
      // Return the new array
      return mewLIst;
    });
  };

  // useEffect(() => {
  //   if (scrollViewRef.current) {
  //     scrollViewRef.current.scrollToEnd({animated: true});
  //   }
  // }, [messages]);

  const handleContentSizeChange = () => {
    console.log('handleContentSizeChange');
    scrollViewRef.current?.scrollToEnd({animated: true});
  };
  const handleLayout = () => {
    console.log('handleLayout');
    scrollViewRef.current?.scrollToEnd({animated: true});
  };
  const handleStop = (msg: Message) => {
    reqErrorHandler(msg._id, msg.text);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView
        style={styles.shortcuts}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
        <QuestionBox
          q={q}
          onVuesaxboldsendPress={ask}
          employee={currentEmployee}
          onAvatarPress={onQuestionBoxAvatarClick}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  },
  shortcuts: {
    //borderRadius: Border.br_lg,
    backgroundColor: Color.white,
    width: '100%',
    overflow: 'hidden',
    paddingHorizontal: Padding.p_sm,
    //paddingVertical: Padding.p_xl,
    paddingBottom: Platform.OS === 'ios' ? 30 : 45,
    flex: 1,
  },
});

export default ShortCuts;
