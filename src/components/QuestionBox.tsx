import * as React from 'react';
import {useCallback, useEffect, useRef, useState} from 'react';

import {
  TextInput,
  StyleSheet,
  Pressable,
  Image,
  TouchableHighlight,
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

import {Margin, Border, Color} from '../../GlobalStyles';
import AppContext, {Employee} from '../persist/AppContext';
import InputWithClear from './tools/InputWithClear';
import {Dimensions, EmitterSubscription} from 'react-native';
import {CustomKeyboardAvoidingView} from './CustomKeyboardAvoidingView';
const deviceWidth = Dimensions.get('window').width;

type QuestionBoxType = {
  q: string;
  onVuesaxboldsendPress: (q: string) => void;
  employee: Employee;
  onAvatarPress?: () => void;
};

const QuestionBox = ({
  q,
  onVuesaxboldsendPress,
  employee,
  onAvatarPress,
}: QuestionBoxType) => {
  const {company} = React.useContext(AppContext);

  const defImg = require('../../assets/vuesaxboldsend.png');
  const [key, setKey] = useState(0);
  const [question, setQuestion] = useState<string>('');
  const inputRef = useRef<TextInput>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentImage, setCurrentImage] = useState(defImg);

  const [inputWidth, setInputWidth] = useState(deviceWidth - 110);

  useEffect(() => {
    const updateWidth = () => {
      const newDeviceWidth = Dimensions.get('window').width;
      setInputWidth(newDeviceWidth - 110);
    };

    // 监听 Dimensions 变化
    const dimensionsSubscription: EmitterSubscription =
      Dimensions.addEventListener('change', updateWidth);

    return () => {
      // 在组件卸载时移除监听器
      dimensionsSubscription.remove();
    };
  }, []);

  React.useEffect(() => {
    setQuestion(q);
  }, [q]);

  const handleSubmit = useCallback(() => {
    // Handle the input submission here
    //console.log(`Submitted input: ${question}`);
    setIsProcessing(true);

    try {
      // 这里执行您的操作
      // 当操作完成时，将 isProcessing 设置回 false
      // Clear the input text after submission
      const q = question.trim();

      setQuestion(() => '');
      // Remove focus from the input field to prevent the return character from being added
      inputRef.current?.blur();
      setKey(prevKey => prevKey + 1);

      onVuesaxboldsendPress(q);
    } catch (error) {
      // 如果出现错误或用户中断操作，将 isProcessing 设置回 false
    } finally {
      setIsProcessing(false);
    }
  }, [question, onVuesaxboldsendPress, inputRef]);

  React.useEffect(() => {
    if (isProcessing) {
      setCurrentImage(require('../../assets/stop.png'));
    } else {
      setCurrentImage(defImg);
    }
  }, [defImg, isProcessing]);

  const handlePress = () => {
    Keyboard.dismiss();
  };

  const styles = StyleSheet.create({
    kavq: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'white',
      flex: 1,
      paddingLeft: 8,
      paddingRight: 8,
    },
    ml10: {
      marginLeft: Margin.m_md,
    },
    mr10: {
      marginRight: Margin.m_md,
    },
    inputWrapper: {
      borderWidth: 0,
      padding: 4,
      borderColor: 'gray',
      borderRadius: 5,
      width: inputWidth, // 设置宽度为父容器宽度
    },
    writeYourMessage: {
      flex: 1,
      backgroundColor: Color.white,
      //padding: 4,
      borderRadius: 4,
      marginEnd: 0,
      //width: '100%',
      minHeight: 36,
      fontSize: 18,
    },
    vuesaxlinearmicrophone2Icon: {
      flex: 1,
      margin: 4,
      padding: 0,
      backgroundColor: 'red',
    },
    icon: {
      flex: 0,
      marginRight: 12,
      alignSelf: 'center',
      alignContent: 'center',
    },
    square: {
      width: 24,
      height: 24,
      backgroundColor: 'red',
    },
    mt8: {
      marginTop: Margin.m_sm,
    },
    inputcontainer: {
      flex: 1,
      borderRadius: Border.br_md,
      backgroundColor: '#e0e0e0',
      shadowColor: 'rgba(0, 0, 0, 0.13)',
      shadowOffset: {
        width: 5,
        height: 4,
      },
      fontSize: 16,
      shadowRadius: 20,
      shadowOpacity: 1,
      flexDirection: 'row',
      borderWidth: 0,
      minHeight: 50,
      //alignSelf: 'flex-start',
      alignItems: 'center',
      verticalAlign: 'middle',
    },
    itemImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
      margin: 8,
    },
    submitImage: {
      width: 30,
      height: 30,
      margin: 8,
      paddingRight: 8,
    },
  });

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <CustomKeyboardAvoidingView style={styles.kavq}>
        <View style={[styles.inputcontainer]}>
          <Pressable onPress={onAvatarPress}>
            <Image
              source={{
                uri: employee.avatar.startsWith('http')
                  ? employee.avatar
                  : company!.config.API_URL +
                    '/assets/avatar/' +
                    employee.avatar,
              }}
              style={styles.itemImage}
            />
          </Pressable>
          <View style={styles.inputWrapper}>
            <InputWithClear
              key={key}
              inputRef={inputRef}
              placeholder=""
              keyboardType="default"
              multiline
              initialValue={question}
              placeholderTextColor="#a1a1a1"
              onChangeText={setQuestion}
              inputStyle={styles.writeYourMessage}
            />
          </View>

          <Pressable onPress={handleSubmit}>
            <Image
              source={{
                uri: currentImage,
              }}
              style={styles.submitImage}
            />
          </Pressable>

        </View>
      </CustomKeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default QuestionBox;
