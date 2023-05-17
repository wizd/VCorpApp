import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

type TextButtonType = {
  title: string;
  onPress: () => void;
};
export const TextButton = ({title, onPress}: TextButtonType) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.itemButton}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemButton: {
    fontSize: 10,
    color: 'blue',
    paddingTop: 5,
    textAlign: 'right',
  },
});
