import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

const ShareBar = ({selectedCount, onShare, onCancel}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>已选 {selectedCount ?? 0} 条消息</Text>
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button title="分享" onPress={onShare} />
        </View>
        <View style={styles.button}>
          <Button title="取消" onPress={onCancel} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  text: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    marginLeft: 10,
  },
});

export default ShareBar;
