import React, {useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  StyleSheet,
} from 'react-native';

interface ToggleButtonProps {
  disabled: boolean;
  disabledImageSource: ImageSourcePropType;
  enabledImageSource: ImageSourcePropType;
  onPress: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  disabled,
  disabledImageSource,
  enabledImageSource,
  onPress,
}) => {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleButton = () => {
    setIsEnabled(!isEnabled);
    onPress();
  };

  const imageSource = isEnabled ? enabledImageSource : disabledImageSource;

  return (
    <TouchableOpacity onPress={toggleButton}>
      <Image
        style={styles.vuesaxlinearvolumeHighIcon}
        resizeMode="cover"
        source={imageSource}
      />
    </TouchableOpacity>
  );
};

export default ToggleButton;

const styles = StyleSheet.create({
  vuesaxlinearvolumeHighIcon: {
    height: 24,
    width: 24,
  },
});
