// Import React and React Native components
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Switch } from 'react-native';
import { Header } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

import CustomButton from '../components/tools/CustomButton';
import DeviceInfo from 'react-native-device-info';
import { useDispatch, useSelector } from 'react-redux';
import { Company } from '../persist/slices/company';
import { setSettings } from '../persist/slices/companySlice';
import { clearAllMsgData } from '../persist/msgstore';

// Define the main component that renders the page
const AppSettings = () => {
  const navigation = useNavigation();

  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);

  const [heightDelta, setHeightDelta] = useState(0 as number);
  const dispatch = useDispatch();
  const company = useSelector((state: any) => state.company) as Company;

  useEffect(() => {
    const devid = DeviceInfo.getDeviceId();
    if (devid.includes('iPhone')) {
      const digits = +devid.replace('iPhone', '').replace(',', '');
      if (digits < 100) {
        setHeightDelta(-10);
      }
    }
  }, []);

  useEffect(() => {
    const loadSettings = async () => {
      const tts = company?.settings.tts;
      const autoSave = company?.settings.autoSaveImage;
      setTtsEnabled(tts === true);
      setAutoSaveEnabled(autoSave === true);
    };

    loadSettings();
  }, [company?.settings.autoSaveImage, company?.settings.tts]);

  useEffect(() => {
    console.log('company object has changed:', company);
  }, [company]);

  const clearChatHistory = async () => {
    console.log('Clear chat history...');
    await clearAllMsgData();
  };

  const saveSettings = () => {
    console.log(
      'saveSettings() called, ttsEnabled: ',
      ttsEnabled,
      ', autoSaveEnabled: ',
      autoSaveEnabled,
    );
    if (company !== null) {
      dispatch(
        setSettings({
          ...company.settings,
          tts: ttsEnabled,
          autoSaveImage: autoSaveEnabled,
        }),
      );
    }

    navigation.goBack();
  };

  const toggleTts = async (value: boolean) => {
    setTtsEnabled(value);
  };

  const toggleAutoSave = async (value: boolean) => {
    console.log('toggleAutoSave() called, value: ', value);
    setAutoSaveEnabled(value);
  };

  return (
    <View style={styles.pageContainer}>
      <Header
        containerStyle={{ marginTop: heightDelta }}
        leftComponent={
          <CustomButton onPress={() => saveSettings()} title="返回" />
        }
        centerComponent={{
          text: '设置',
          style: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
        }}
        backgroundColor="#3D6DCC"
      />
      <View style={styles.container}>
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>自动语音播报:</Text>
          <Switch value={ttsEnabled} onValueChange={toggleTts} />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>自动保存图片到相册:</Text>
          <Switch value={autoSaveEnabled} onValueChange={toggleAutoSave} />
        </View>
        <CustomButton
          title="清除所有聊天记录"
          onPress={clearChatHistory}
          buttonStyle={styles.clearButton}
        />
      </View>
    </View>
  );
};

export default AppSettings;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  outerContainer: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  clearButton: {
    marginTop: 20,
    backgroundColor: '#3D6DCC',
    borderRadius: 10,
    paddingVertical: 12,
  },
});
