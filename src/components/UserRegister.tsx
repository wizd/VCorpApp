import {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import AppContext from '../persist/AppContext';
import {LyraCrypto} from '../crypto/lyra-crypto';
import axios from 'axios';
import React from 'react';
import {Color, FontFamily, FontSize, Margin, Padding} from '../../GlobalStyles';
import {useToast} from '../utils/useToast';

const UserRegister = () => {
  const {company, setCompany} = useContext(AppContext);
  const [isInitialized, setIsInitialized] = useState(false);
  const showToast = useToast();

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
    try {
      const ret = await api.post('/register', data);
      console.log('register result: ', ret.data);
      if (ret.data.success) {
        setCompany(prev => ({...prev!, jwt: ret.data.data.token}));

        showToast('成功登录对话服务器，可以开启 AI 奇幻旅程了！');
        // const exists = await checkTtsEngine();
        // console.log('TTS engine: ', exists);
        // setCompany(prev => ({
        //   ...prev!,
        //   settings: {
        //     ...prev!.settings,
        //     tts: exists && (prev!.settings.tts ?? true),
        //   },
        // }));
      } else {
        showToast('登录对话服务器失败，原因是：' + ret.data.error.message + '');
      }
    } catch (error) {
      console.error('Request failed:', error);
      // Check if error.response exists and the status code is 500
      if (error.response && error.response.status === 500) {
        // Extract additional information about the error
        console.log('error.response: ', error.response);
        const errorMessage = error.response.data.error;
        showToast('登录对话服务器失败，原因是：' + errorMessage);
      } else {
        showToast('登录对话服务器失败，请稍后重试');
      }
    }
  };

  useEffect(() => {
    if (company && company.jwt) {
      setIsInitialized(true);
      return;
    }

    if (company && !company.jwt) {
      setIsInitialized(false);
      // auth when jwt is not set or expired.
      auth();
      return;
    }

    setIsInitialized(true);
  }, [company]);

  return (
    <View>
      {isInitialized ? (
        <Text style={[styles.online, styles.ml5]}>Online</Text>
      ) : (
        <Text style={[styles.offline, styles.ml5]}>Offline</Text>
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
