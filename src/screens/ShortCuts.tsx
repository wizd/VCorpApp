import {
  StyleSheet,
  View,
  Platform,
  KeyboardAvoidingView,
  FlatList,
  Share,
  SafeAreaView,
} from 'react-native';
import EventSource, {
  EventSourceListener,
  EventSourceOptions,
} from 'react-native-sse';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';

import {Margin, Padding} from '../../GlobalStyles';
import {useEffect, useRef, useState} from 'react';

import TitleSection from '../components/TitleSection';
import QuickActions from '../components/QuickActions';
import QuestionBox from '../components/QuestionBox';

import ArrowGuide from '../components/help/ArrowGuide';

import {
  VwsImageMessage,
  VwsMessage,
  VwsSystemMessage,
  VwsTextMessage,
  VwsVideoMessage,
  isVwsAudioMessage,
  isVwsImageMessage,
  isVwsSystemMessage,
  isVwsTextMessage,
  isVwsVideoMessage,
} from '../comm/wsproto';
import {useDispatch, useSelector} from 'react-redux';
import {Company} from '../persist/slices/company';
import {
  registerUser,
  setAIBusy,
  tourialDone,
} from '../persist/slices/companySlice';
import {chatClient, createShareOnServer} from '../persist/slices/chatSlice';
import {playSound} from '../persist/slices/playlistSlice';
import MessageItem from '../components/tools/MessageItem';
import ShareBar from '../components/tools/ShareBar';
import {
  AppendMessage,
  Message,
  addMessage,
  deselectAllMessages,
  removeSelectedMessages,
  toggleMessageSelected,
  updateMessage,
  updateMessageWavUrl,
  updateSelectedMessages,
} from '../persist/slices/messageSlice';

const ShortCuts = () => {
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList>(null);

  const [q, setQ] = useState<string>('');
  const messages = useSelector(
    (state: any) => state.message.messages,
  ) as Message[];
  const selectedCount = messages.reduce(
    (count, message) => (message.isSelected ? count + 1 : count),
    0,
  );

  const dispatch = useDispatch();
  const company = useSelector((state: any) => state.company) as Company;
  const [showArrow, setShowArrow] = useState(true);
  const [isShareMode, setIsShareMode] = useState(false);

  // const {beginReading, endReading} = useTts({
  //   isEnabled: company?.settings.tts ?? false,
  // });

  useEffect(() => {
    setShowArrow(company?.settings.guide ?? true);
  }, [company]);

  // useEffect(() => {
  //   const storeData = async () => {
  //     // if (messages.length > 0) {
  //     //   flatListRef.current?.scrollToEnd({animated: true});
  //     // }
  //     await storeMsgData(messages);
  //   };

  //   storeData();
  // }, [messages]);

  useEffect(() => {
    const handleNewMessage = (smessage: VwsMessage) => {
      // 处理新消息，例如更新状态或显示通知
      //console.log('New message received to main chat UI:', smessage);

      if (isVwsTextMessage(smessage)) {
        if (smessage.cid !== undefined) {
          dispatch(
            AppendMessage({
              messageId: smessage.id,
              part: (smessage as VwsTextMessage).content,
              final: smessage.final === true,
            }),
          );
        } else {
          // check if speech for the some message
          const txt = (smessage as VwsTextMessage).content;

          if (
            txt.startsWith('https://r.vcorp.ai/') &&
            (txt.endsWith('.mp3') || txt.endsWith('.wav'))
          ) {
            dispatch(setAIBusy(false));
            if (company?.settings?.tts) {
              console.log(
                'in main UI, company?.settings?.tts try to add to playlist:',
                smessage,
              );

              if (company?.settings.tts && txt !== undefined) {
                dispatch(playSound(txt));
              }
            }

            dispatch(
              updateMessageWavUrl({
                messageId: smessage.id,
                wavUrl: txt,
              }),
            );
          } else {
            //check if the message is a speech recognition result
            // this is the result of a speech recognition
            if (smessage.id.endsWith('-vr')) {
              dispatch(
                updateMessage({
                  messageId: smessage.id,
                  newText: (smessage as VwsTextMessage).content,
                  isLoading: false,
                }),
              );
              return;
            }

            // a normal AI reply. Add the last message to the list
            const message = {
              _id: smessage.id,
              text: (smessage as VwsTextMessage).content,
              createdAt: new Date().toISOString(),
              isLoading: !(smessage as VwsTextMessage).final,
              isAI: true,
              veid: smessage.src ?? company?.curid ?? 'A0001',
              bypass: company?.curid.startsWith('D') ?? false,
            };
            dispatch(addMessage(message));
          }
        }
      } else if (isVwsImageMessage(smessage)) {
        // display the image
        const imgurl = (smessage as VwsImageMessage).url;
        const message = {
          _id: smessage.id,
          text: '```image\n' + imgurl + '\n```',
          createdAt: new Date().toISOString(),
          isLoading: false,
          isAI: true,
          veid: smessage.src,
          bypass: company?.curid.startsWith('D') ?? false,
        };
        dispatch(addMessage(message));
      } else if (isVwsVideoMessage(smessage)) {
        // display the video
        const imgurl = (smessage as VwsVideoMessage).url;
        const message = {
          _id: smessage.id,
          text: '```video\n' + imgurl + '\n```',
          createdAt: new Date().toISOString(),
          isLoading: false,
          isAI: true,
          veid: smessage.src,
          bypass: company?.curid.startsWith('D') ?? false,
        };
        dispatch(addMessage(message));
      } else if (isVwsAudioMessage(smessage)) {
        //
        console.log("Audio message received, don't know how to handle it");
      } else if (isVwsSystemMessage(smessage)) {
        //
        const cmdmsg = smessage as VwsSystemMessage;
        console.log('System message received for', cmdmsg.cmd, cmdmsg.note);
        if (cmdmsg.cmd === 'shared') {
          const reply = JSON.parse(cmdmsg.note);

          Share.share(reply)
            .then(result => {
              if (result.action === Share.sharedAction) {
                console.log('Shared!');
              } else if (result.action === Share.dismissedAction) {
                console.log('Dismissed!');
              }
            })
            .catch(error => console.log(error));
        }
      }
    };

    if (chatClient !== null) {
      // 在组件挂载时注册事件监听器
      chatClient.on('message', handleNewMessage);

      // 在组件卸载时注销事件监听器
      return () => {
        chatClient!.off('message', handleNewMessage);
      };
    }

    //console.log('in main chat UI, chatState is ', chatState);
    // if (chatState.newMessages && chatState.newMessages.length > 0) {
    //   const incomingMsg =
    //     chatState.newMessages[chatState.newMessages.length - 1];
    //   handleNewMessage(incomingMsg);
    //   dispatch(clearMessage(incomingMsg));
    // }
  }, [company?.curid, company?.settings.tts, dispatch]);

  const onQuestionBoxAvatarClick = () => {
    setShowArrow(false);
    dispatch(tourialDone());
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

  const handleContentSizeChange = () => {
    if (messages.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToEnd({animated: true});
    }
  };

  const onVoiceSent = (msgid: string) => {
    console.log('voice sent. msgid is ', msgid);
  };

  const ask = (question: string, existingUserMsgId?: string) => {
    setQ('');
    let newContent = '';
    let userMsg: Message;
    if (existingUserMsgId) {
      console.log(
        'try to modify a speech msssage. existingUserMsgId is ',
        existingUserMsgId,
      );
      userMsg = messages.find(m => m._id === existingUserMsgId && !m.isAI);

      dispatch(
        updateMessage({
          messageId: existingUserMsgId,
          newText: question,
          isLoading: false,
        }),
      );

      if (userMsg === undefined) {
        console.log('userMsg is undefined');
        return;
      }

      console.log('speech to text, userMsg is ', userMsg);
    } else {
      //Add the last message to the list
      userMsg = {
        _id: new Date().getTime().toString(),
        text: question,
        createdAt: new Date().toISOString(),
        isLoading: false,
        isAI: false,
        veid: company?.curid ?? 'A0001',
        bypass: false,
      };

      dispatch(addMessage(userMsg));
    }

    const url = company!.config.API_URL + '/vc/v1/chat'; // replace with your API url

    // construct message history to send to the API
    let history = [
      {
        role: 'user',
        content: question,
      },
    ];

    for (let i = messages.length - 1; i >= 0 && i > messages.length - 4; i--) {
      const msg = messages[i];
      if (msg.veid?.startsWith('D') || msg.bypass) {
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

    //Add the last message to the list
    const message = {
      _id: (+userMsg._id + 1).toString(),
      text: '',
      createdAt: new Date().toISOString(),
      isLoading: true,
      isAI: true,
      veid: company?.curid,
      bypass: company?.curid.startsWith('D'),
    };
    dispatch(addMessage(message));

    autoScroll();

    // Parameters to pass to the API
    const data = {
      version: 4,
      id: message._id,
      veid: company!.curid,
      vename: company!.employees.find(e => e.id === company!.curid)?.name,
      messages: history,
    };

    const options: EventSourceOptions = {
      method: 'POST', // Request method. Default: GET
      timeout: 30000, // Time after which the connection will expire without any activity: Default: 0 (no timeout)
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${company!.jwt}`,
      }, // Your request headers. Default: {}
      body: JSON.stringify(data), // Your request body sent on connection: Default: undefined
      debug: true, // Show console.debug messages for debugging purpose. Default: false
      pollingInterval: 3600000, // Time (ms) between reconnections. Default: 5000
    };

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
          const serverResponse = JSON.parse(event.data!);
          const delta = serverResponse.choices[0].delta;

          // Check if is the last text to close the events request
          const finish_reason = serverResponse.choices[0].finish_reason;
          reason = finish_reason!;

          if (finish_reason != null) {
            if (reason !== 'stop') {
              newContent = newContent + ' [ends with ' + reason + ']';
            }
            es.close();
          } else {
            if (delta && delta.content) {
              //beginReading(delta.content);
              // Update content with new data
              newContent = newContent + delta.content;
            } else {
            }
            //setMessages([...message, newContent]);
          }

          // Continuously update the last message in the state
          // with new piece of data
          dispatch(
            updateMessage({
              messageId: message._id,
              newText: newContent,
            }),
          );
        } else {
          es.close();
          console.log('done. the answer is: ', newContent);
          //endReading();
          dispatch(
            updateMessage({
              messageId: message._id,
              isLoading: false,
            }),
          );
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

      autoScroll();
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

  const reqErrorHandler = (msgid: string, txt: string) => {
    console.log('reqErrorHandler, msgid: ', msgid, ', txt: ', txt);

    let msgpadding =
      txt +
      ' \n\n（非常抱歉，出现了网络错误。请稍候重试一次。或者请尝试点击这个链接升级 App 到最新版本：https://vcorp.ai/ )';

    // check 401 error and retry
    if (txt.indexOf('401') > 0) {
      console.log('401 error, retrying...');

      dispatch(registerUser());

      msgpadding =
        '非常抱歉出现了网络错误。已尝试重新登陆服务器。。。请再试一次。';
    }

    dispatch(
      updateMessage({
        messageId: msgid,
        newText: msgpadding,
        isLoading: false,
      }),
    );
  };

  const handleBeginShare = useCallback(
    (msg: Message) => {
      console.log('handleShare, msg: ', msg);
      // auto select current message and previous one
      const index = messages.findIndex(message => message._id === msg._id);

      if (index === -1) {
        console.error('Message not found in list');
        return;
      }
      dispatch(updateSelectedMessages(index));

      setIsShareMode(true);
    },
    [dispatch, messages],
  );

  const beginCreateShare = useCallback(() => {
    console.log('beginCreateShare');
    setIsShareMode(false);
    dispatch(
      createShareOnServer(
        JSON.stringify(messages.filter(message => message.isSelected)),
      ),
    );
    dispatch(deselectAllMessages());
  }, [dispatch, messages]);

  const handleCancelShare = useCallback(() => {
    console.log('handleCancelShare');
    setIsShareMode(false);
    dispatch(deselectAllMessages());
  }, [dispatch]);

  const handleDelete = useCallback(() => {
    console.log('handleDelete');
    dispatch(removeSelectedMessages());
  }, [dispatch]);

  const handleSelectMessage = useCallback(
    (item: Message) => {
      console.log('handleSelectMessage, item: ', item);
      dispatch(toggleMessageSelected(item._id));
    },
    [dispatch],
  );

  const handleStop = (msg: Message) => {
    dispatch(
      updateMessage({
        messageId: msg._id,
        isLoading: false,
      }),
    );
  };

  const autoScroll = () => {
    //console.log('autoScroll, flatListRef: ', flatListRef.current);
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({animated: true});
    }
  };

  const styles = StyleSheet.create({
    kav: {
      //paddingBottom: Platform.OS === 'ios' ? 80 : 60,
      flex: 1,
      backgroundColor: 'white',
      marginTop: 4,
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
      //alignSelf: 'stretch',
      flex: 1,
      paddingHorizontal: Padding.p_sm,
    },
    shortcuts: {
      //borderRadius: Border.br_lg,
      //backgroundColor: 'blue',
      width: '100%',
      //overflow: 'hidden',
      //paddingHorizontal: Padding.p_sm,
      //paddingVertical: Padding.p_xl,
      //paddingBottom: Platform.OS === 'ios' ? 78 : 58,
      flexGrow: 1,
    },
  });

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView
        style={styles.kav}
        enabled={true}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TitleSection />
        <View style={styles.shortcuts}>
          {showArrow && <ArrowGuide />}
          <FlatList
            style={[styles.frameParent, styles.mt8]}
            removeClippedSubviews={false}
            horizontal={false}
            onContentSizeChange={handleContentSizeChange}
            data={messages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <MessageItem
                item={item}
                index={index}
                isShareMode={isShareMode}
                handleStop={handleStop}
                handleShare={handleBeginShare}
                handleSelectMessage={handleSelectMessage}
              />
            )}
            ListHeaderComponent={
              <>
                <View style={[styles.shortcutsChild, styles.mt8]} />
                <QuickActions pressed={setQ} />
              </>
            }
            ListFooterComponent={<></>}
            contentContainerStyle={{flexGrow: 1, paddingBottom: 16}}
            keyboardShouldPersistTaps="handled"
            //onContentSizeChange={autoScroll}
            ref={flatListRef}
          />
        </View>

        <View>
          {isShareMode && (
            <ShareBar
              selectedCount={selectedCount}
              onShare={beginCreateShare}
              onCancel={handleCancelShare}
              onDelete={handleDelete}
            />
          )}
          {!isShareMode && (
            <QuestionBox
              q={q}
              onSendQuestion={ask}
              onSendVoice={onVoiceSent}
              employee={company?.employees?.find(e => e.id === company?.curid)}
              onAvatarPress={onQuestionBoxAvatarClick}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ShortCuts;
