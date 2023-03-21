import * as React from 'react';
import {Text, StyleSheet, View, ActivityIndicator} from 'react-native';
import {FontSize, FontFamily, Color, Border, Padding} from '../../GlobalStyles';
import Markdown from './Markdown';

const AIMessage = (props: any) => {
  return (
    <View style={[styles.frameWrapper, styles.mt24]}>
      <View style={styles.helloimFinehowCanIHelpWrapper}>
        <Markdown text={props.text} />
      </View>
      <View>
        {props.isLoading && <ActivityIndicator size="small" color="#0000ff" />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mt24: {
    marginTop: 24,
  },
  helloimFinehowCan: {
    fontSize: FontSize.size_lg,
    fontWeight: '700',
    fontFamily: FontFamily.nunitoRegular,
    color: '#000000',
    textAlign: 'left',
  },
  helloimFinehowCanIHelpWrapper: {
    borderTopLeftRadius: Border.br_sm,
    borderTopRightRadius: Border.br_sm,
    borderBottomRightRadius: Border.br_sm,
    backgroundColor: Color.whitesmoke_200,
    flexDirection: 'row',
    padding: Padding.p_md,
    alignItems: 'center',
  },
  frameWrapper: {
    alignSelf: 'stretch',
    padding: Padding.p_xs,
    justifyContent: 'center',
  },
});

export default AIMessage;
