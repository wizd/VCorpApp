import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Color, FontFamily, FontSize, Margin, Padding} from '../../GlobalStyles';
import {useSelector} from 'react-redux';
import {ChatServerState} from '../persist/slices/chatSlice';

const UserRegister = () => {
  const chatState = useSelector((state: any) => state.chat) as ChatServerState;

  return (
    <View style={styles.frameParentFlexBox}>
      {chatState.isOnline ? (
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
          <Text style={[styles.offline, styles.ml5]}>重新连线中...</Text>
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
