import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface SmallButtonProps {
  onPress?: () => void;
  onLongPress?: () => void;
  size?: number;
  color?: string;
  iconName: string;
}

const SmallButton: React.FC<SmallButtonProps> = ({
  onPress,
  onLongPress = () => {},
  size = 20,
  color = 'black',
  iconName,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.button}>
      <Icon name={iconName} size={size} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 36, // Half the button size
    borderWidth: 1,
    borderColor: '#ddd', // Soft grey color
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default SmallButton;
