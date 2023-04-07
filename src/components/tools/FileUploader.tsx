import React, {useContext, useState} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import * as Progress from 'react-native-progress';
import axios, {AxiosProgressEvent} from 'axios';
import AppContext from '../../persist/AppContext';

const FileUploader = () => {
  const {company, setCompany} = useContext(AppContext);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

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
      uploadFile(result);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.error('DocumentPicker Error: ', err);
      }
    }
  };

  const uploadFile = async (file: DocumentPickerResponse) => {
    const data = new FormData();
    data.append('file', {
      uri: file.uri,
      type: file.type,
      name: file.name,
    });

    const config = {
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total! ?? 10000000,
        );
        setProgress(percentCompleted);
      },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    setUploading(true);
    try {
      const url = company!.config.API_URL + '/upload';
      await axios.post(url, data, config);
      console.log('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <TouchableOpacity onPress={pickDocument} style={styles.button}>
        <Text style={styles.buttonText}>
          {uploading ? 'Uploading...' : 'Upload File'}
        </Text>
      </TouchableOpacity>
      {uploading && (
        <Progress.Bar
          progress={progress / 100}
          width={300}
          style={{width: '80%', marginTop: 20}}
          color="#007AFF"
        />
      )}
    </View>
  );
};

const styles = {
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
};

export default FileUploader;
