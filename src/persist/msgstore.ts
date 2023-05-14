import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Message {
  _id: string;
  text: string;
  isLoading: boolean;
  isAI: boolean;
  veid?: string;
  createdAt: Date;
  bypass?: boolean;
  wavurl?: string;
}

// 存储数据
export const storeMsgData = async (value: Message[]) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('@storage_Key', jsonValue);
  } catch (e) {
    // saving error
  }
};

// 获取数据
export const getMsgData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@storage_Key');
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    // error reading value
  }
};
