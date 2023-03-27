import * as React from 'react';
import {Text, StyleSheet, View, ToastAndroid} from 'react-native';
import {FontSize, FontFamily, Color, Border, Padding} from '../../GlobalStyles';
import Clipboard from '@react-native-community/clipboard';

const UserMessage = (props: any) => {
  const handleCopy = () => {
    Clipboard.setString(props.text);
    ToastAndroid.show('文本已复制到剪贴板', ToastAndroid.SHORT);
  };

  return (
    <View style={styles.frameWrapper}>
      <View style={styles.helloChatgpthowAreYouTodaWrapper}>
        <Text
          selectable={true}
          style={styles.helloChatgpthowAre}
          onLongPress={handleCopy}>
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
