import Toast from 'react-native-toast-message';

export const useToast = () => {
  const showToast = (message: string, type: string = 'success') => {
    // Define styles for different toast types
    const toastStyles = {
      success: {
        backgroundColor: '#4CAF50', // Green
        textColor: '#FFFFFF',
      },
      failed: {
        backgroundColor: '#FF9800', // Orange
        textColor: '#FFFFFF',
      },
      error: {
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
      text2: '',
      style: {
        backgroundColor: currentStyles.backgroundColor,
      },
      textStyle: {
        color: currentStyles.textColor,
      },
    });
  };

  return showToast;
};
