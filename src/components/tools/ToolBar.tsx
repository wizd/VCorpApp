import React from 'react';
import {View, StyleSheet} from 'react-native';
import SmallButton from './SmallButton'; // Assuming this is the file path

const Toolbar = () => {
  const onReadPress = () => {
    console.log('Read button pressed');
    // Add functionality here
  };

  const onSharePress = () => {
    console.log('Share button pressed');
    // Add functionality here
  };

  const onCopyPress = () => {
    console.log('Copy button pressed');
    // Add functionality here
  };

  return (
    <View style={styles.toolbar}>
      <View style={styles.buttonWrapper}>
        <SmallButton iconName="volume-up" onPress={onReadPress} />
      </View>
      <View style={styles.buttonWrapper}>
        <SmallButton iconName="share" onPress={onSharePress} />
      </View>
      <View style={styles.buttonWrapper}>
        <SmallButton iconName="content-copy" onPress={onCopyPress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 200,
    width: 48,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 4,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 30,
    right: -12,
  },
  buttonWrapper: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    padding: 4,
    margin: 4,
  },
});

export default Toolbar;
