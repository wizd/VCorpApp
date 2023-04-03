import * as React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {FontSize, FontFamily, Color, Border, Padding} from '../../GlobalStyles';
import Clipboard from '@react-native-community/clipboard';
import Toast from 'react-native-toast-message';

const UserMessage = (props: any) => {
  const showToast = () => {
    Toast.show({
      type: 'success',
      position: 'top',
      text1: '',
      text2: '内容已复制到剪贴板',
    });
  };

  const handleCopy = () => {
    Clipboard.setString(props.text);
    showToast();
  };

  return (
    <View style={styles.frameWrapper}>
      <View style={styles.helloChatgpthowAreYouTodaWrapper}>
        <Text style={styles.helloChatgpthowAre} onLongPress={handleCopy}>
          {props.text}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  helloChatgpthowAre: {
    fontSize: FontSize.size_lg,
    fontWeight: '700',
    fontFamily: FontFamily.nunitoBold,
    color: Color.white,
    textAlign: 'left',
  },
  helloChatgpthowAreYouTodaWrapper: {
    borderTopLeftRadius: Border.br_sm,
    borderBottomRightRadius: Border.br_sm,
    borderBottomLeftRadius: Border.br_sm,
    backgroundColor: Color.blue1,
    flexDirection: 'row',
    padding: Padding.p_md,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  frameWrapper: {
    alignSelf: 'stretch',
    padding: Padding.p_xs,
    alignItems: 'flex-end',
  },
});

export default UserMessage;
