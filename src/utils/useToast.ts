import Toast from 'react-native-toast-message';

export const useToast = () => {
  const showToast = (message: string, type: string = 'success') => {
    Toast.show({
      type: type,
      position: 'top',
      text1: '',
      text2: message,
    });
  };

  return showToast;
};
