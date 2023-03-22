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
      <View style={[styles.buttonsContainer]}>
        <QuickQuestonButton
          pressed={props.pressed}
          q="我的朋友说你是神级大佬，我现在对你非常崇拜。你真的是大佬吗？"
          frame44MarginTop={8}
        />
        <QuickQuestonButton
          q="帮我写一首诗，赞颂有了人工智以后的幸福生活。用七律来写，模仿李白的风格。"
          pressed={props.pressed}
          frame44MarginTop={8}
        />
        <QuickQuestonButton
          q="帮我写个朋友圈消息，说我也用上人工智能了！我的朋友们都很好奇，你来挑逗一下他们吧。"
          pressed={props.pressed}
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
    alignItems: 'center', // 修改为 flex-start
    justifyContent: 'center',
  },
  buttonsContainer: {
    flex: 1,
    //alignItems: 'stretch', // 新增
    justifyContent: 'space-between', // 新增
    flexDirection: 'column', // 新增
    //paddingVertical: 15,
    //margin: 5,
  },
});

export default QuickActions;
