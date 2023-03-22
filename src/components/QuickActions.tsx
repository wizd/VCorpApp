import * as React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import QuickQuestonButton from '../components/QuickQuestonButton';
import {Margin, FontSize, FontFamily, Color} from '../../GlobalStyles';

const QuickActions = (props: any) => {
  return (
    <View style={styles.frameParent}>
      <View style={styles.frameParent}>
        <Image
          style={styles.vuesaxlinearedit2Icon}
          resizeMode="cover"
          source={require('../../assets/vuesaxlinearedit2.png')}
        />
        <Text style={[styles.writeEdit, styles.mt5]}>{`让我们开始吧`}</Text>
      </View>
      <View style={[styles.frameParent, styles.mt18]}>
        {/* <QuickQuestonButton q={`Using: ${API_URL}`} pressed={props.pressed} /> */}
        <QuickQuestonButton
          q="写个朋友圈消息，说我也用上人工智能了"
          pressed={props.pressed}
        />
        <QuickQuestonButton
          q="写一首歌，赞颂人工智能改变了生活"
          pressed={props.pressed}
          frame44MarginTop={8}
        />
        <QuickQuestonButton
          pressed={props.pressed}
          q="如果我有个问题，我可以问人工智能吗？"
          frame44MarginTop={8}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mt5: {
    marginTop: Margin.m_xs,
  },
  mt8: {
    marginTop: Margin.m_sm,
  },
  mt18: {
    marginTop: 18,
  },
  vuesaxlinearedit2Icon: {
    width: 24,
    height: 24,
  },
  writeEdit: {
    fontSize: FontSize.size_base,
    fontWeight: '700',
    fontFamily: FontFamily.nunitoBold,
    color: Color.darkslategray_100,
    textAlign: 'left',
  },
  frameParent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default QuickActions;
