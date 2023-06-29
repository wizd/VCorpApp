import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import * as Progress from 'react-native-progress';
import axios, {AxiosProgressEvent} from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {Company} from '../../persist/slices/company';
import {
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import {uploadFileSuccess} from '../../persist/slices/companySlice';
import {useToast} from '../../utils/useToast';

/* toggle includeExtra */
const includeExtra = true;

const FileUploader = () => {
  const showToast = useToast();
  const dispatch = useDispatch();
  const company = useSelector((state: any) => state.company) as Company;
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [filename, setFilename] = useState('');

  const pickDocument = async () => {
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      const result = results[0];
      console.log(
        'Selected File:',
        result.uri,
        result.type, // mime type
        result.name,
        result.size,
      );
      setFilename(result.name!);
      uploadDocument(result);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.error('DocumentPicker Error: ', err);
      }
    }
  };

  const pickImage = async () => {
    const options = {
      saveToPhotos: true,
      mediaType: 'mixed',
      includeExtra,
      presentationStyle: 'fullScreen',
    };

    launchImageLibrary(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.assets && response.assets.length > 0) {
        const source = {uri: response.assets[0].uri};
        console.log(
          'Selected File:',
          response.assets[0].uri,
          response.assets[0].type,
          response.assets[0].fileName,
          response.assets[0].fileSize,
        );
        setFilename(response.assets[0].fileName!);
        uploadImage(response);
      }
    });
  };

  const uploadImage = async (file: ImagePickerResponse) => {
    if (!file.assets || file.assets?.length === 0) {
      return;
    }
    const data = new FormData();
    data.append('file', {
      uri: file.assets[0].uri,
      type: file.assets[0].type,
      name: file.assets[0].fileName,
    });
    data.append('veid', company.curid);

    uploadFile(data, file.assets[0].fileName!);
  };

  const uploadDocument = async (file: DocumentPickerResponse) => {
    const data = new FormData();
    data.append('file', {
      uri: file.uri,
      type: file.type,
      name: file.name,
    });
    data.append('veid', company.curid);
    uploadFile(data, file.name!);
  };

  const uploadFile = async (data: FormData, name: string) => {
    const config = {
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total! ?? 10000000,
        );
        setProgress(percentCompleted);
      },
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${company!.jwt}`,
      },
    };

    setUploading(true);
    try {
      const url = company!.config.API_URL + '/vc/v1/image/upload';
      await axios.post(url, data, config);
      console.log('File uploaded successfully');

      dispatch(uploadFileSuccess(name));
      showToast(`上传成功！`);
    } catch (error) {
      console.log('Error uploading file:', error);

      // 提取服务器返回的错误信息
      const errorMessage =
        error.response && error.response.data
          ? error.response.data
          : (error as any).message;
      showToast(`上传失败。也许这个AI暂不接受文件上传呢。`);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={pickDocument} style={styles.button}>
          <Text style={styles.buttonText}>
            {uploading ? '正在上传...' : '上传文件'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={pickImage} style={styles.button}>
          <Text style={styles.buttonText}>
            {uploading ? '正在上传...' : '上传图片'}
          </Text>
        </TouchableOpacity>
      </View>
      {uploading && (
        <Progress.Bar
          progress={progress / 100}
          width={300}
          style={styles.progressBar}
          color="#007AFF"
        />
      )}
      <Text style={styles.filename}>{filename}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  progressBar: {
    width: '80%',
    marginTop: 20,
  },
  filename: {
    marginTop: 10,
  },
});

export default FileUploader;
