import React, {FC} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import ImageSaver from './ImageSaver';
import VideoPlayer from './tools/VideoPlayer'; // 导入 VideoPlayer 组件

export interface CodeBlockProps {
  language: string;
  code: string;
}

const CodeBlock: FC<CodeBlockProps> = ({language, code}) => {
  const handleCopy = () => {
    Clipboard.setString(code);
  };

  return (
    <View style={styles.codeBlockContainer}>
      {language === 'image' && code && code.trim() !== '' ? (
        <ImageSaver source={{uri: code.trim()}} />
      ) : language === 'video' && code && code.trim() !== '' ? (
        <VideoPlayer videoUrl={code.trim()} />
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.language}>{language}</Text>
            <TouchableOpacity onPress={handleCopy} style={styles.copyButton}>
              <Text style={styles.copyButtonText}>Copy</Text>
            </TouchableOpacity>
          </View>
          <Text selectable={true} style={styles.code}>
            {code}
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeBlockContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    padding: 0,
    backgroundColor: '#F5F5F5',
    marginBottom: 16,
  },
  header: {
    backgroundColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 4,
    paddingLeft: 8,
  },
  language: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  copyButton: {
    backgroundColor: '#1976D2',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  copyButtonText: {
    fontSize: 12,
    color: '#FFF',
  },
  code: {
    fontFamily: 'Courier New',
    fontSize: 14,
    color: '#333',
    padding: 8,
  },
});

export default CodeBlock;
