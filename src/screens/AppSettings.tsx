// Import React and React Native components
import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Text, Switch} from 'react-native';
import {Header} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';

import AppContext from '../persist/AppContext';
import CustomButton from '../components/tools/CustomButton';

// Define the main component that renders the page
const AppSettings = () => {
  const navigation = useNavigation();
  const {company, setCompany} = useContext(AppContext);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    console.log('company object has changed:', company);
  }, [company]);

  const loadSettings = async () => {
    const tts = company?.settings.tts;
    const autoSave = company?.settings.autoSaveImage;
    setTtsEnabled(tts === true);
    setAutoSaveEnabled(autoSave === true);
  };

  const saveSettings = () => {
    console.log(
      'saveSettings() called, ttsEnabled: ',
      ttsEnabled,
      ', autoSaveEnabled: ',
      autoSaveEnabled,
    );
    setCompany({
      ...company,
      settings: {
        ...company?.settings,
        tts: ttsEnabled,
        autoSaveImage: autoSaveEnabled,
        guide: company?.settings?.guide,
      },
    });

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
