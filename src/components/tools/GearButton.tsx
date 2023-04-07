import React from 'react';
import {TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';

interface GearButtonProps {
  navigateTo: string;
}

const GearButton: React.FC<GearButtonProps> = ({navigateTo}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate(navigateTo);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <FontAwesome name="cog" size={24} color="black" />
    </TouchableOpacity>
  );
};

export default GearButton;
