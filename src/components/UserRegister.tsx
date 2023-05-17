import {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Color, FontFamily, FontSize, Margin, Padding} from '../../GlobalStyles';
import {useChat} from '../persist/ChatContext';

const UserRegister = () => {
  const {chatClient} = useChat();
  const [isOnline, setIsOnline] = useState(false); // 创建一个新的状态变量来记录连接状态
  useEffect(() => {
    // 创建一个函数来处理连接状态改变
    //console.log('UserRegister.tsx useEffect sensed connection socket changed');
    const handleStatusChange = (status: boolean) => {
      //console.log('connection status is: ', status);
      setIsOnline(status);
    };

    setIsOnline(chatClient.isConnected());

    // 注册状态改变监听器
    chatClient.onConnectionStatusChange(handleStatusChange);

    // 在组件卸载时，取消监听器
    return () => {
      chatClient.offConnectionStatusChange(handleStatusChange);
    };
  }, [chatClient]);

  return (
    <View style={styles.frameParentFlexBox}>
      {isOnline ? (
        <>
          <Image
            style={styles.frameChild}
            resizeMode="cover"
            source={require('../../assets/ellipse-11.png')}
          />
          <Text style={[styles.online, styles.ml5]}>在线</Text>
        </>
      ) : (
        <>
          <Image
            style={styles.frameChild}
            resizeMode="cover"
            source={require('../../assets/ellipse-1.png')}
          />
          <Text style={[styles.offline, styles.ml5]}>已离线</Text>
        </>
      )}
    </View>
  );
};

export default UserRegister;

const styles = StyleSheet.create({
  ml5: {
    marginLeft: Margin.m_xs,
  },
  mt1: {
    marginTop: Margin.m_2xs,
  },
  ml20: {
    marginLeft: Margin.m_xl,
  },
  ml19: {
    marginLeft: Margin.m_lg,
  },
  frameParentFlexBox: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  blueRobotMascotLogoIconDe: {
    height: 48,
    width: 48,
    borderRadius: 8,
  },
  chatgpt: {
    fontSize: FontSize.size_xl,
    fontWeight: '700',
    fontFamily: FontFamily.nunitoBold,
    color: Color.blue1,
    textAlign: 'left',
  },
  frameChild: {
    width: 6,
    height: 6,
  },
  online: {
    fontSize: FontSize.size_lg,
    fontWeight: '500',
    fontFamily: FontFamily.nunitoMedium,
    color: Color.limegreen,
    textAlign: 'left',
  },
  offline: {
    fontSize: FontSize.size_lg,
    fontWeight: '500',
    fontFamily: FontFamily.nunitoMedium,
    color: 'red',
    textAlign: 'left',
  },
  blueRobotMascotLogoIconDeParent: {
    justifyContent: 'center',
  },
  chatgptParent: {
    justifyContent: 'center',
  },
  frameWrapper: {
    flex: 1,
  },
  vuesaxlinearvolumeHighIcon: {
    height: 24,
    width: 24,
  },
  frameParent: {
    alignSelf: 'stretch',
    height: 51,
    paddingHorizontal: Padding.p_md,
    paddingVertical: 0,
  },
});
