import * as React from 'react';
import {Text, StyleSheet, View, Image, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Margin, FontFamily, Color, Border} from '../../GlobalStyles';

const Onboarding = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.onboarding}>
      <View style={styles.parentFlexBox}>
        <Text style={[styles.youAiAssistant, styles.continueTypo]}>
          AI, 你的
        </Text>
        <Text style={[styles.usingThisSoftwareyouContainer, styles.mt14]}>
          <Text style={styles.usingThisSoftwareyou}>
            欢迎来到人工智能大市场，这里有你想要的一切智能产品和服务，让你的生活更便捷、更高效、更有趣！
          </Text>
        </Text>
      </View>
      <Image
        style={styles.onboardingChild}
        resizeMode="cover"
        source={require('../../assets/frame-33.png')}
      />
      <Pressable
        style={[styles.continueParent, styles.parentFlexBox]}
        onPress={() => navigation.navigate('ShortCuts' as never)}>
        <Text style={[styles.continue, styles.continueTypo]}>开始</Text>
        <Image
          style={[styles.vuesaxlineararrowRightIcon, styles.ml10]}
          resizeMode="cover"
          source={require('../../assets/vuesaxlineararrowright.png')}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  mt14: {
    marginTop: 14,
  },
  ml10: {
    marginLeft: Margin.m_md,
  },
  continueTypo: {
    textAlign: 'left',
    fontFamily: FontFamily.nunitoBold,
    fontWeight: '700',
  },
  parentFlexBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  youAiAssistant: {
    fontSize: 23,
    color: Color.blue1,
  },
  usingThisSoftwareyou: {
    //marginBlockStart: 0,
    //marginBlockEnd: 0
  },
  artificialIntelligenceAssist: {
    margin: 0,
  },
  usingThisSoftwareyouContainer: {
    fontSize: 15,
    fontWeight: '500',
    fontFamily: FontFamily.nunitoMedium,
    color: '#757575',
    textAlign: 'center',
  },
  onboardingChild: {
    width: 320,
    height: 324,
  },
  continue: {
    fontSize: 19,
    color: Color.white,
    zIndex: 0,
  },
  vuesaxlineararrowRightIcon: {
    position: 'absolute',
    top: 16,
    left: 289,
    width: 24,
    height: 24,
    zIndex: 1,
  },
  continueParent: {
    borderRadius: Border.br_md,
    backgroundColor: Color.blue1,
    width: 333,
    height: 56,
    flexDirection: 'row',
  },
  onboarding: {
    borderRadius: Border.br_lg,
    backgroundColor: Color.white,
    flex: 1,
    width: '100%',
    height: 839,
    overflow: 'hidden',
    paddingHorizontal: 21,
    paddingVertical: 61,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default Onboarding;
