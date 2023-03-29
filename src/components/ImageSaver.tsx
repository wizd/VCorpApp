import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Button,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import RNFS, {DownloadResult} from 'react-native-fs';
import {basename} from 'react-native-path';
import AutoImage from './AutoImage';
import {imgPlaceHolder} from '../utils/util';

async function hasAndroidPermission() {
  const permission =
    Platform.Version >= 33
      ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
      : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

  const hasPermission = await PermissionsAndroid.check(permission);
  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(permission);
  return status === 'granted';
}

const savePicture = async (tag: string) => {
  if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
    return;
  }

  CameraRoll.save(tag);
};

interface SaveToCameraRollButtonProps {
  uri: string;
}

const SaveToCameraRollButton: React.FC<SaveToCameraRollButtonProps> = ({
  uri,
}) => {
  const handleSaveToCameraRoll = async () => {
    console.log('saving image from uri: ', uri);
    await savePicture(uri);
  };

  return (
    <View style={styles.saveButtonContainer}>
      <Button title="Save to Camera Roll" onPress={handleSaveToCameraRoll} />
    </View>
  );
};

interface ImageModalProps {
  visible: boolean;
  uri: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({visible, uri, onClose}) => {
  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.modalImageContainer} onPress={onClose}>
          {uri !== null && uri !== '' && (
            <Image
              source={{uri: uri ?? imgPlaceHolder}}
              style={styles.modalImage}
            />
          )}
        </TouchableOpacity>
        <SaveToCameraRollButton uri={uri} />
      </View>
    </Modal>
  );
};

interface ImageWithModalProps {
  source: {uri: string};
}

interface NetworkImageProps {
  imageUrl: string;
  saved: (tag: string) => void;
}
const NetworkImage: React.FC<NetworkImageProps> = ({imageUrl, saved}) => {
  const [localImagePath, setLocalImagePath] = useState<string | null>(null);
  const isMountedRef = useRef(false);

  useEffect(() => {
    if (!isMountedRef.current) {
      const downloadImage = async () => {
        const fileName = basename(imageUrl);
        const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
        const fileExists = await RNFS.exists(path);
        if (fileExists) {
          const localPath = `file://${path}`;
          setLocalImagePath(localPath);
          console.log('Image loaded from cache:', localPath);
          saved(localPath);
        } else {
          const {jobId, promise} = RNFS.downloadFile({
            fromUrl: imageUrl,
            toFile: path,
          });
          const result: DownloadResult = await promise;
          if (result.statusCode === 200) {
            const localPath = `file://${path}`;
            setLocalImagePath(localPath);
            console.log('Image downloaded and saved to:', localPath);
            saved(localPath);
          } else {
            console.error('Failed to download image:', result.statusCode);
          }
        }
      };

      downloadImage();
      isMountedRef.current = true;
    }
  }, [imageUrl, saved]);

  if (localImagePath) {
    return (
      <AutoImage
        source={localImagePath}
        style={styles.image}
        resizeMode="cover"
      />
    );
  }

  return <View style={styles.container} />;
};

const ImageWithModal: React.FC<ImageWithModalProps> = ({source}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tag, setTag] = useState<string | null>(null);

  const handleImagePress = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity onPress={handleImagePress}>
        <NetworkImage imageUrl={source.uri} saved={fp => setTag(fp)} />
      </TouchableOpacity>
      {tag && (
        <ImageModal
          visible={modalVisible}
          uri={tag}
          onClose={handleCloseModal}
        />
      )}
    </View>
  );
};

export interface ImageSaverProps {
  source: {uri: string};
}

const ImageSaver: React.FC<ImageSaverProps> = (props: ImageSaverProps) => {
  return (
    <View style={styles.container}>
      <ImageWithModal source={props.source} />
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
    aspectRatio: 1, // 可以根据图片的宽高比进行调整
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
    aspectRatio: 1, // 可以根据图片的宽高比进行调整
    resizeMode: 'contain',
  },
  saveButtonContainer: {
    backgroundColor: 'white',
    padding: 10,
  },
});

export default ImageSaver;
