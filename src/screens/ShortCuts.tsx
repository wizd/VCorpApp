import {
  StyleSheet,
  View,
  Platform,
  KeyboardAvoidingView,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
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
import {useChat} from '../persist/ChatContext';
import {MessageCallback} from '../comm/chatClient';
import {
  VwsImageMessage,
  VwsTextMessage,
  isVwsAudioMessage,
  isVwsImageMessage,
  isVwsTextMessage,
} from '../comm/wsproto';

interface Message {
  _id: string;
  text: string;
  isLoading: boolean;
  isAI: boolean;
  veid: string;
  createdAt: Date;
  bypass: boolean;
  wavurl?: string;
}

const ShortCuts = () => {
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList>(null);

  const [q, setQ] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  const {company, setCompany} = useContext(AppContext);
  const [showArrow, setShowArrow] = useState(true);

  const {endReading} = useTts({
    isEnabled: company?.settings.tts ?? false,
  });

  const {sendMessage, onNewMessage, offNewMessage} = useChat();

  useEffect(() => {
    const handleNewMessage: MessageCallback = smessage => {
      // 处理新消息，例如更新状态或显示通知
      console.log('New message received:', smessage);

      if (isVwsTextMessage(smessage)) {
        if (smessage.cid !== undefined) {
          setMessages(previousMessages => {
            // Get the last array
            const last = [...previousMessages];

            // Update the list
            const mewLIst = last.map((m, _i) => {
              if (m._id === smessage.id) {
                m.text += (smessage as VwsTextMessage).content;
                m.isLoading = smessage.final === false;
              }
              return m;
            });
            // Return the new array
            return mewLIst;
          });
          flatListRef.current?.scrollToEnd({animated: true});
        } else {
          // check if speech for the some message
          const txt = (smessage as VwsTextMessage).content;

          if (txt.startsWith('https://r.vcorp.ai/') && txt.endsWith('.wav')) {
            setMessages(currentMessages => {
              // 使用 currentMessages 而不是 messages
              const txtmsg2 = currentMessages.find(m => m._id === smessage.id);
              console.log(
                'current messages is ',
                currentMessages,
                'txtmsg2 is ',
                txtmsg2,
              );
              if (txtmsg2 !== undefined) {
                // 创建一个新的消息数组
                console.log("I'll update msg with wavurl");
                const updatedMessages = currentMessages.map(m =>
                  m._id === txtmsg2._id ? {...m, wavurl: txt} : m,
                );
                // 返回更新后的消息数组
                return updatedMessages;
              }
              // 如果没有找到对应的消息，返回未修改的消息数组
              return currentMessages;
            });
          } else {
            //Add the last message to the list
            const message = {
              _id: smessage.id,
              text: (smessage as VwsTextMessage).content,
              createdAt: new Date(),
              isLoading: !(smessage as VwsTextMessage).final,
              isAI: true,
              veid: company?.curid ?? 'A0001',
              bypass: company?.curid.startsWith('D') ?? false,
            };
            setMessages(previousMessages => [...previousMessages, message]);
          }
        }
      } else if (isVwsImageMessage(smessage)) {
        // display the image
        const imgurl = (smessage as VwsImageMessage).url;
        const message = {
          _id: smessage.id,
          text: '```image\n' + imgurl + '\n```',
          createdAt: new Date(),
          isLoading: false,
          isAI: true,
          veid: smessage.src,
          bypass: company?.curid.startsWith('D') ?? false,
        };
        setMessages(previousMessages => [...previousMessages, message]);
        flatListRef.current?.scrollToEnd({animated: true});
      } else if (isVwsAudioMessage(smessage)) {
        //
        console.log("Audio message received, don't know how to handle it");
      }
    };

    onNewMessage(handleNewMessage);
    return () => {
      offNewMessage(handleNewMessage);
    };
  }, [onNewMessage, offNewMessage, company?.curid]);

  const onQuestionBoxAvatarClick = () => {
    setShowArrow(false);
    const newcompany = {
      ...company,
      settings: {
        ...company?.settings,
        guide: false,
      },
    };
    setCompany(newcompany);
    navigation.navigate('Employees' as never);
  };

  // setCurrentEmployee(company.employees.find(e => e.id == company.curid));
  // if (!currentEmployee) {
  //   const newcompany = {
  //     ...company,
  //     curid: company.employees[0].id,
  //   };
  //   setCompany(newcompany);
  //   currentEmployee = company.employees[0];
  // }

  useEffect(() => {
    setShowArrow(company?.settings.guide ?? true);
  }, [company]);

  const ask = (question: string) => {
    setQ('');

    //Add the last message to the list
    const userMsg = {
      _id: new Date().getTime().toString(),
      text: question,
      createdAt: new Date(),
      isLoading: false,
      isAI: false,
      veid: company?.curid ?? 'A0001',
      bypass: false,
    };

    setMessages(previousMessages => [...previousMessages, userMsg]);
    flatListRef.current?.scrollToEnd({animated: true});

    sendMessage({
      id: userMsg._id.toString() + '-0',
      src: company?.name ?? 'test',
      dst: userMsg.veid,
      time: Date.now(),
      type: 'text',
      content: question,
      final: true,
    });
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

  // const reqErrorHandler = (msgid: number, txt: string) => {
  //   console.log('reqErrorHandler, msgid: ', msgid, ', txt: ', txt);

  //   let msgpadding =
  //     txt +
  //     ' \n\n（非常抱歉，出现了网络错误。请稍候重试一次。或者请尝试点击这个链接升级 App 到最新版本：https://vcorp.ai/ )';

  //   // check 401 error and retry
  //   if (txt.indexOf('401') > 0) {
  //     console.log('401 error, retrying...');

  //     const newcompany = {
  //       ...company,
  //       jwt: null,
  //     };
  //     setCompany(newcompany);

  //     msgpadding =
  //       '非常抱歉出现了网络错误。已尝试重新登陆服务器。。。请再试一次。';
  //   }

  //   setMessages(previousMessages => {
  //     // Get the last array
  //     const last = [...previousMessages];

  //     // Update the list
  //     const mewLIst = last.map((m, _i) => {
  //       if (m._id === msgid) {
  //         m.isLoading = false;
  //         m.text = msgpadding;
  //         m.bypass = true;
  //       }

  //       return m;
  //     });
  //     // Return the new array
  //     return mewLIst;
  //   });
  //   endReading();
  // };

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
    setMessages(previousMessages => {
      // Get the last array
      const last = [...previousMessages];

      // Update the list
      const mewLIst = last.map((m, _i) => {
        if (m._id === msg._id) {
          m.isLoading = false;
        }

        return m;
      });
      // Return the new array
      return mewLIst;
    });
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
        employee={company?.employees?.find(e => e.id === company?.curid)}
        onAvatarPress={onQuestionBoxAvatarClick}
      />
    </View>
  );
};

export default ShortCuts;
