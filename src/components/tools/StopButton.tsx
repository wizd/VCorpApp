import React from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface StopButtonProps {
  onPress: () => void;
  size?: number;
  color?: string;
  iconName: string;
}

const StopButton: React.FC<StopButtonProps> = ({
  onPress,
  size = 24,
  color = 'black',
  iconName,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Icon name={iconName} size={size} color={color} />
    </TouchableOpacity>
  );
};

export default StopButton;
