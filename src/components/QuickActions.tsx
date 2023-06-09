import * as React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import QuickQuestonButton from './tools/QuickQuestonButton';
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
          q="我的朋友们都说你非常厉害，我对你的能力充满好奇。你能告诉我你都会什么吗？"
          frame44MarginTop={8}
        />
        <View style={styles.buttonSpacer} />
        <QuickQuestonButton
          q="我想请你帮我写一首赞美人工智能带来幸福生活的诗。能用七律的形式来写，模仿李白的风格吗？"
          pressed={props.pressed}
          frame44MarginTop={8}
        />
        <View style={styles.buttonSpacer} />
        <QuickQuestonButton
          q="能帮我写一个朋友圈动态吗？告诉我的朋友们我也开始使用人工智能了！让他们感到好奇和有趣。"
          pressed={props.pressed}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonSpacer: {
    height: 15, // 新增
  },
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
    padding: 8,
  },
  buttonsContainer: {
    flex: 1,
    alignItems: 'stretch', // 新增
    justifyContent: 'space-evenly', // 新增
    flexDirection: 'column', // 新增
    //paddingVertical: 15,
    marginTop: 8,
  },
});

export default QuickActions;
