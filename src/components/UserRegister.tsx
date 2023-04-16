import {useContext, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import AppContext from '../persist/AppContext';
import {LyraCrypto} from '../crypto/lyra-crypto';
import axios from 'axios';
import React from 'react';
import {Color, FontFamily, FontSize, Margin, Padding} from '../../GlobalStyles';

const UserRegister = () => {
  const {company, setCompany} = useContext(AppContext);

  const auth = async () => {
    console.log('registering my company: ', company);
    if (!company) {
      return;
    }

    const baseUrl = company.config.API_URL + '/vc/v1/user';
    const usr = {
      accountId: LyraCrypto.GetAccountIdFromPrivateKey(company.privatekey),
    };
    const data = {
      user: usr,
      signature: LyraCrypto.Sign(JSON.stringify(usr), company.privatekey),
    };
    const api = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });
    const ret = await api.post('/register', data);
    console.log('register result: ', ret.data);
    if (ret.data.success) {
      setCompany(prev => ({...prev!, jwt: ret.data.data.token}));

      const exists = await checkTtsEngine();
      console.log('TTS engine: ', exists);
      setCompany(prev => ({
        ...prev!,
        settings: {
          ...prev!.settings,
          tts: exists && (prev!.settings.tts ?? true),
        },
      }));
    }
  };

  useEffect(() => {
    auth();
  }, []);

  return (
    <View>
      <Text style={[styles.online, styles.ml5]}>Online</Text>
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
