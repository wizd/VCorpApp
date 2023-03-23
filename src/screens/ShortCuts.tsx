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
  createdAt: Date;
}

const ShortCuts = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const flatListRef = useRef<FlatList>(null);

  const [q, setQ] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  const [tts] = useState(() => new TextToSpeech(10));

  const {company, setCompany} = useContext(AppContext);

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

  //console.log('currentEmployee', currentEmployee);

  const beginReading = (txt: string) => {
    if (company.settings?.tts) {
      tts.emitTextGen(txt);
    }
  };

  const textFinished = () => {
    tts.emitTextEnd();
  };

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
    };

    setMessages(previousMessages => [...previousMessages, userMsg]);

    if (true) {
      const url = company.config.API_URL + '/vc/v1/chat'; // replace with your API url

      // Parameters to pass to the API
      const data = {
        version: 2,
        veid: currentEmployee.id,
        vename: currentEmployee.name,
        messages: question,
      };

      const options: EventSourceOptions = {
        method: 'POST', // Request method. Default: GET
        //timeout: 0, // Time after which the connection will expire without any activity: Default: 0 (no timeout)
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer AAABBBCCCCCCC`,
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
        } else if (event.type === 'exception') {
          console.error('Error:', event.message, event.error);
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
      console.error('Please insert a prompt!');
    }
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({animated: true});
    }
  }, [scrollViewRef.current, messages]);

  const handleContentSizeChange = () => {
    console.log('handleContentSizeChange');
    scrollViewRef.current?.scrollToEnd({animated: true});
  };
  const handleLayout = () => {
    console.log('handleLayout');
    scrollViewRef.current?.scrollToEnd({animated: true});
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView
        style={styles.shortcuts}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
          avatar={currentEmployee.avatar}
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
    borderRadius: Border.br_lg,
    backgroundColor: Color.white,
    width: '100%',
    overflow: 'hidden',
    paddingHorizontal: Padding.p_sm,
    paddingVertical: Padding.p_xl,
    flex: 1,
  },
});

export default ShortCuts;
