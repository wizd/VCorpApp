import Toast from 'react-native-toast-message';

export const useToast = () => {
  const showToast = (
    message: string,
    type: 'success' | 'error' | 'info' = 'success',
  ) => {
    // Define styles for different toast types
    const toastStyles = {
      success: {
        backgroundColor: '#4CAF50', // Green
        textColor: '#FFFFFF',
      },
      error: {
        backgroundColor: '#FF9800', // Orange
        textColor: '#FFFFFF',
      },
      info: {
        backgroundColor: '#F44336', // Red
        textColor: '#FFFFFF',
      },
    };

    // Get styles for the current toast type
    const currentStyles = toastStyles[type] || toastStyles.success;

    Toast.show({
      type: type,
      position: 'top',
      text1: message,
      visibilityTime: 3000, // 3 seconds
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40,
      textStyle: {
        color: currentStyles.textColor,
      },
    });
  };

  return showToast;
};
