import axios from 'axios';
import {ReactNativeFile} from 'apollo-upload-client';

async function uploadImageAndJson(
  imageFile: ReactNativeFile,
  jsonData: object,
) {
  try {
    // 创建一个FormData实例，以便上传图像和JSON数据
    const formData = new FormData();
    formData.append('image', imageFile);
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

export default uploadImageAndJson;
