import * as React from 'react';
import {useContext} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Margin, FontSize, FontFamily, Color, Padding} from '../../GlobalStyles';
import AppContext from '../persist/AppContext';
import GearButton from './tools/GearButton';
import UserRegister from './UserRegister';

const TitleSection = () => {
  const {company, setCompany} = useContext(AppContext);

  const setTtsEnabled = () => {
    if (company) {
      setCompany({
        ...company,
        settings: {
          ...company.settings,
          tts: company?.settings.tts,
        },
      });
    }
  };

  return (
    <View style={[styles.frameParent, styles.frameParentFlexBox]}>
      <View style={[styles.frameWrapper, styles.frameParentFlexBox]}>
        <View
          style={[
            styles.blueRobotMascotLogoIconDeParent,
            styles.frameParentFlexBox,
          ]}>
          <Image
            style={styles.blueRobotMascotLogoIconDe}
            resizeMode="cover"
            source={require('../../assets/logo_sm.png')}
          />
          <View style={[styles.chatgptParent, styles.ml20]}>
            <Text style={styles.chatgpt}>ChatGPT</Text>
            <View
              style={[
                styles.blueRobotMascotLogoIconDeParent,
                styles.mt1,
                styles.frameParentFlexBox,
              ]}>
              <View
                style={[
                  styles.blueRobotMascotLogoIconDeParent,
                  styles.frameParentFlexBox,
                ]}>
                <Image
                  style={styles.frameChild}
                  resizeMode="cover"
                  source={require('../../assets/ellipse-11.png')}
                />
                <UserRegister />
              </View>
            </View>
          </View>
        </View>
      </View>
      <View
        style={[
          styles.blueRobotMascotLogoIconDeParent,
          styles.frameParentFlexBox,
        ]}>
        <GearButton navigateTo="Settings" />
      </View>
    </View>
  );
};

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

export default TitleSection;
