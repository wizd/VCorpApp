import React from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface SmallButtonProps {
  onPress: () => void;
  onLongPress?: () => void;
  size?: number;
  color?: string;
  iconName: string;
}

const SmallButton: React.FC<SmallButtonProps> = ({
  onPress,
  onLongPress = () => {},
  size = 24,
  color = 'black',
  iconName,
}) => {
  return (
    <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
      <Icon name={iconName} size={size} color={color} />
    </TouchableOpacity>
  );
};

export default SmallButton;
