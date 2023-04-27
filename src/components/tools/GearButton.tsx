import React from 'react';
import {Pressable} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
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
    <Pressable onPress={handlePress}>
      <FontAwesomeIcon icon="fa-solid fa-gear" size={24} color="black" />
    </Pressable>
  );
};

export default GearButton;
