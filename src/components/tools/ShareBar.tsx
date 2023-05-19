import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const ShareBar = ({selectedCount, onShare, onCancel, onDelete}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>已选 {selectedCount ?? 0} 条消息</Text>
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <TouchableOpacity onPress={onShare}>
            <Text style={styles.buttonText}>分享</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.button}>
          <TouchableOpacity onPress={onCancel}>
            <Text style={styles.buttonText}>取消</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.button}>
          <TouchableOpacity>
            <Text style={styles.buttonSpace}></Text>
          </TouchableOpacity>
        </View>
        <View style={styles.button}>
          <TouchableOpacity onPress={onDelete}>
            <Text style={styles.buttonTextRed}>删除</Text>
          </TouchableOpacity>
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
    marginLeft: 20,
  },
  buttonText: {
    color: '#007AFF', // blue color similar to iOS standard button color
    textAlign: 'center',
  },
  buttonSpace: {
    color: '#007AFF', // blue color similar to iOS standard button color
    textAlign: 'center',
    minWidth: 30,
  },
  buttonTextRed: {
    color: 'red',
    textAlign: 'center',
  },
});

export default ShareBar;
