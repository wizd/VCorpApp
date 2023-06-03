import React from 'react';
import {StyleSheet} from 'react-native';
import FullScreenDialog from '../components/FullScreenDialog';
import FileUploader from '../components/tools/FileUploader';

const AdvancedInput = () => {
  return (
    <FullScreenDialog title="高级输入">
      <FileUploader />
    </FullScreenDialog>
  );
};

const styles = StyleSheet.create({});

export default AdvancedInput;
