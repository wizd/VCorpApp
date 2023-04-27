import React, {useEffect, useState, useRef, useContext} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Button,
  Platform,
} from 'react-native';
import {WebView} from 'react-native-webview';
import AutoImage from './AutoImage';
import {imgPlaceHolder, isNullOrEmpty} from '../utils/util';
import * as Progress from 'react-native-progress';
import AppContext from '../persist/AppContext';
import {useToast} from '../utils/useToast';

// 使用此函数来保存图片，而不是在 savePicture 中使用 PermissionsAndroid 和 CameraRoll
const saveToCameraRoll = async uri => {
  if (Platform.OS === 'web') {
    const a = document.createElement('a');
    a.href = uri;
    a.download = 'image.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    // 用于原生平台的保存图片逻辑
  }
};

const ImageSaver: React.FC<ImageSaverProps> = (props: ImageSaverProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tag, setTag] = useState<string | null>(null);

  const showToast = useToast();

  const handleImagePress = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleSaveToCameraRoll = async () => {
    console.log('saving image from uri: ', tag);
    await saveToCameraRoll(tag);
    showToast('图片已保存到相册');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleImagePress}>
        <AutoImage source={props.source} />
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalImageContainer}
            onPress={handleCloseModal}>
            {tag !== null &&
              tag !== '' &&
              (Platform.OS === 'web' ? (
                <WebView
                  source={{
                    html: `<img src="${
                      tag ?? imgPlaceHolder
                    }" style="width: 100%; height: 100%; object-fit: contain;" />`,
                  }}
                  style={styles.modalImage}
                />
              ) : (
                <Image
                  source={{uri: tag ?? imgPlaceHolder}}
                  style={styles.modalImage}
                />
              ))}
          </TouchableOpacity>
          <View style={styles.saveButtonContainer}>
            <Button title="保存到相册" onPress={handleSaveToCameraRoll} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    width: '100%',
    aspectRatio: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
  },

  modalImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    flex: 1,
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  saveButtonContainer: {
    backgroundColor: 'white',
    padding: 10,
  },
});

export default ImageSaver;
