import React from 'react';
import {View, StyleSheet} from 'react-native';
import SmallButton from './SmallButton'; // Assuming this is the file path

interface ToolbarProps {
  onReadPress?: () => void;
  onSharePress?: () => void;
  onCopyPress?: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onReadPress,
  onSharePress,
  onCopyPress,
}) => {
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
    height: 150,
    width: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 4,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 40,
    right: -8,
    shadowColor: '#000',
    shadowOffset: {
      width: 3,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 15,
    alignItems: 'center',
  },
  buttonWrapper: {
    flex: 1,
    justifyContent: 'center',
    height: 32, // Make the button a perfect circle
    width: 32,
  },
});

export default Toolbar;
