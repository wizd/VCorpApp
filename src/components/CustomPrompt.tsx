import React from 'react';
import {Alert, Platform} from 'react-native';
import prompt from 'react-native-prompt-android';

export type CustomPromptProps = {
  isVisible: boolean;
  title: string;
  message: string;
  onSubmit: (name: string | undefined) => void;
  onCancel: () => void;
};

const CustomPrompt = ({
  isVisible,
  title,
  message,
  onSubmit,
  onCancel,
}: CustomPromptProps) => {
  const showPrompt = () => {
    if (Platform.OS === 'ios') {
      Alert.prompt(
        title,
        message,
        [
          {
            text: 'Cancel',
            onPress: () => onCancel(),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: name => onSubmit(name),
          },
        ],
        'plain-text',
      );
    } else {
      prompt(
        title,
        message,
        [
          {text: 'Cancel', onPress: () => onCancel()},
          {text: 'OK', onPress: name => onSubmit(name)},
        ],
        {
          type: 'plain-text',
          cancelable: false,
        },
      );
    }
  };

  if (isVisible) {
    showPrompt();
  }

  return null;
};

export default CustomPrompt;
