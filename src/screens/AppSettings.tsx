// Import React and React Native components
import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Text, Switch} from 'react-native';
import {Header} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';

import AppContext from '../persist/AppContext';
import CustomButton from '../components/tools/CustomButton';
import DeviceInfo from 'react-native-device-info';

// Define the main component that renders the page
const AppSettings = () => {
  const navigation = useNavigation();
  const {company, setCompany} = useContext(AppContext);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);

  const [heightDelta, setHeightDelta] = useState(-50 as number);

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

  const saveSettings = () => {
    console.log(
      'saveSettings() called, ttsEnabled: ',
      ttsEnabled,
      ', autoSaveEnabled: ',
      autoSaveEnabled,
    );
    if (company !== null) {
      setCompany({
        ...company,
        settings: {
          ...company?.settings,
          tts: ttsEnabled,
          autoSaveImage: autoSaveEnabled,
        },
      });
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

  // Return the JSX element that renders the page
  return (
    // Use a View component as a container for the page
    <View style={styles.pageContainer}>
      <Header
        containerStyle={{marginTop: heightDelta}}
        leftComponent={
          <CustomButton onPress={() => saveSettings()} title="返回" />
        }
        centerComponent={{
          text: '设置',
          style: {color: '#fff', fontSize: 20},
        }}
        // rightComponent={
        //   <Button onPress={() => alert('This is a button!')} title="" />
        // }
        backgroundColor="#3D6DCC"
      />
      <View style={styles.container}>
        <View style={styles.settingRow}>
          <Text>自动语音播报:</Text>
          <Switch value={ttsEnabled} onValueChange={toggleTts} />
        </View>
        <View style={styles.settingRow}>
          <Text>自动保存图片到相册:</Text>
          <Switch value={autoSaveEnabled} onValueChange={toggleAutoSave} />
        </View>
      </View>
    </View>
  );
};

export default AppSettings;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#fff',
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
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
});
