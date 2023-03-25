import * as React from 'react';
import {useCallback, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
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

import {Margin, Border, Color, Padding} from '../../GlobalStyles';
import AppContext from '../persist/AppContext';

type QuestionBoxType = {
  q: string;
  onVuesaxboldsendPress: (q: string) => void;
  avatar: string;
};

const QuestionBox = ({q, onVuesaxboldsendPress, avatar}: QuestionBoxType) => {
  const navigation = useNavigation();
  const {company, setCompany} = React.useContext(AppContext);

  const defImg = require('../../assets/vuesaxboldsend.png');
  const [key, setKey] = useState(0);
  const [question, setQuestion] = useState<string>('');
  const inputRef = useRef<TextInput>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentImage, setCurrentImage] = useState(defImg);

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
  }, [isProcessing]);

  const handlePress = () => {
    Keyboard.dismiss();
  };

  const handleVEList = () => {
    console.log('handleVEList');
  };

  return (
    <TouchableWithoutFeedback>
      <View style={[styles.inputbox, styles.mt8]}>
        <Pressable onPress={() => navigation.navigate('Employees' as never)}>
          <Image
            source={{
              uri: avatar.startsWith('http')
                ? avatar
                : company.config.API_URL + '/assets/avatar/' + avatar,
            }}
            style={styles.itemImage}
          />
        </Pressable>
        <TextInput
          style={styles.writeYourMessage}
          key={key} // add a key prop
          ref={inputRef}
          placeholder=""
          keyboardType="default"
          multiline
          value={question}
          placeholderTextColor="#a1a1a1"
          onChangeText={setQuestion}
        />

        <TouchableHighlight
          style={[styles.vuesaxlinearmicrophone2Icon, styles.ml10]}
          underlayColor="#fff"
          activeOpacity={0.2}
          onPress={handleSubmit}>
          {isProcessing ? (
            <View style={styles.square} />
          ) : (
            <Image
              style={styles.icon}
              resizeMode="cover"
              source={currentImage}
            />
          )}
        </TouchableHighlight>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  ml10: {
    marginLeft: Margin.m_md,
  },
  mt8: {
    marginTop: Margin.m_sm,
  },
  writeYourMessage: {
    flex: 1,
  },
  vuesaxlinearmicrophone2Icon: {
    width: 24,
    height: 24,
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  square: {
    width: 24,
    height: 24,
    backgroundColor: 'red',
  },
  inputbox: {
    alignSelf: 'stretch',
    borderRadius: Border.br_md,
    backgroundColor: Color.white,
    shadowColor: 'rgba(0, 0, 0, 0.13)',
    shadowOffset: {
      width: 5,
      height: 4,
    },
    fontSize: 16,
    shadowRadius: 20,
    elevation: 20,
    shadowOpacity: 1,
    flexDirection: 'row',
    paddingHorizontal: Padding.p_sm,
    paddingVertical: Padding.p_sm,
    alignItems: 'center',
    borderWidth: 0,
  },
  questionBox: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 0,
  },
});

export default QuestionBox;
