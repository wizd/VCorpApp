import * as React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {FontSize, FontFamily, Color, Border, Padding} from '../../GlobalStyles';

const UserMessage = (props: any) => {
  return (
    <View style={styles.frameWrapper}>
      <View style={styles.helloChatgpthowAreYouTodaWrapper}>
        <Text selectable={true} style={styles.helloChatgpthowAre}>
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
