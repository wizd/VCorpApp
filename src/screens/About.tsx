import React from 'react';
import {Text, TouchableOpacity, Linking, StyleSheet, View} from 'react-native';
import FullScreenDialog from '../components/FullScreenDialog';

const About = () => {
  return (
    <FullScreenDialog title="关于">
      <View style={styles.container}>
        <Text style={styles.title}>微可</Text>
        <Text style={styles.subtitle}>Version 1.0.51</Text>
        <Text style={styles.description}>
          微可 App
          是配合微可AI中间件使用的智能应用，具有诸多强大功能，可帮助您更高效地完成工作。
        </Text>
        <TouchableOpacity
          onPress={() => Linking.openURL('https://vcorp.ai/privacy')}>
          <Text style={styles.link}>隐私政策</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Linking.openURL('https://vcorp.ai/terms')}>
          <Text style={styles.link}>使用条款</Text>
        </TouchableOpacity>
        <Text style={styles.companyInfo}>
          开发商：微可智能科技有限公司{'\n'}
          联系方式：info@vcorp.ai
        </Text>
      </View>
    </FullScreenDialog>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#888',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  link: {
    fontSize: 16,
    color: '#1e90ff',
    marginBottom: 10,
  },
  companyInfo: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});

export default About;
