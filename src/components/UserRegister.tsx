import {useContext, useEffect, useCallback, useRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import AppContext from '../persist/AppContext';
import {LyraCrypto} from '../crypto/lyra-crypto';
import axios from 'axios';
import React from 'react';
import {Color, FontFamily, FontSize, Margin, Padding} from '../../GlobalStyles';
import {useToast} from '../utils/useToast';

const UserRegister = () => {
  const {company, setCompany} = useContext(AppContext);
  const isInitialized = useRef(false);
  const showToast = useToast();

  const auth = useCallback(async () => {
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
      if (ret.data.success) {
        setCompany({
          ...company,
          jwt: ret.data.data.token as string,
        });
        showToast('成功登录对话服务器，可以开启 AI 奇幻旅程了！');
      } else {
        showToast('登录对话服务器失败，原因是：' + ret.data.error.message);
      }
      isInitialized.current = true;
    } catch (error) {
      if (error.response && error.response.status === 500) {
        const errorMessage = error.response.data.error;
        showToast('登录对话服务器失败，原因是：' + errorMessage);
      } else {
        showToast('登录对话服务器失败，请稍后重试');
      }
      isInitialized.current = true;
    }
  }, [company, setCompany, showToast]);

  useEffect(() => {
    if (company && !company.jwt) {
      auth();
    } else {
      isInitialized.current = true;
    }
  }, [auth, company]);

  return (
    <View>
      {isInitialized.current ? (
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
