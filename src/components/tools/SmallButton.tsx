import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface SmallButtonProps {
  onPress?: () => void;
  onLongPress?: () => void;
  size?: number;
  color?: string;
  iconName: string;
  border?: boolean;
}

const SmallButton: React.FC<SmallButtonProps> = ({
  onPress,
  onLongPress = () => {},
  size = 20,
  color = 'black',
  iconName,
  border = true,
}) => {
  const styles = border
    ? StyleSheet.create({
        button: {
          borderRadius: 36, // Half the button size
          borderWidth: 1,
          borderColor: '#ddd', // Soft grey color
          padding: 4,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        },
      })
    : StyleSheet.create({
        button: {
          borderRadius: 36, // Half the button size
          padding: 4,
          justifyContent: 'center',
          alignItems: 'center',
        },
      });

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.button}>
      <Icon name={iconName} size={size} color={color} />
    </TouchableOpacity>
  );
};

export default SmallButton;
