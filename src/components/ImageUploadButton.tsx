import React, {useCallback} from 'react';
import {Button, Alert} from 'react-native';
import ImagePicker, {Image} from 'react-native-image-picker';
import axios from 'axios';

const ImageUploadButton: React.FC = () => {
  const pickImage = useCallback(async () => {
    const options = {
      title: 'Select Photo',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const imageFile: ReactNativeFile = {
          uri: response.uri,
          type: response.type,
          name: response.fileName,
        };

        const jsonData = {
          key1: 'value1',
          key2: 'value2',
        };

        await uploadImageAndJson(imageFile, jsonData);
      }
    });
  }, []);

  return <Button title="Pick Image and Upload" onPress={pickImage} />;
};

interface ReactNativeFile {
  uri: string;
  type: string | null;
  name: string | null;
}

async function uploadImageAndJson(
  imageFile: ReactNativeFile,
  jsonData: object,
) {
  try {
    // 创建一个FormData实例，以便上传图像和JSON数据
    const formData = new FormData();
    formData.append('image', imageFile as any);
    formData.append('jsonData', JSON.stringify(jsonData));

    // 使用axios发送POST请求
    const response = await axios.post(
      'http://localhost:3000/api/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    console.log('Upload successful:', response.data);
  } catch (error: any) {
    console.error('Error uploading image and JSON:', error.message);
  }
}

export default ImageUploadButton;
