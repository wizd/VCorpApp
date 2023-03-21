import React from 'react';
import {Alert, Platform} from 'react-native';
import prompt from 'react-native-prompt-android';

export type CustomPromptProps = {
  isVisible: boolean;
  onSubmit: (name: string | undefined) => void;
  onCancel: () => void;
};

const CustomPrompt = ({isVisible, onSubmit, onCancel}: CustomPromptProps) => {
  const showPrompt = () => {
    if (Platform.OS === 'ios') {
      Alert.prompt(
        'Enter your name',
        'Please enter your name below:',
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
        'Enter your name',
        'Please enter your name below:',
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
