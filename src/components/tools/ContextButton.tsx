import React, {useState, useCallback} from 'react';
import {View, Animated} from 'react-native';
import SmallButton from './SmallButton'; // Assuming this is the file path
import Toolbar from './ToolBar'; // Assuming this is the file path

interface ToolbarButtonProps {
  onReadPress?: () => void;
  onSharePress?: () => void;
  onCopyPress?: () => void;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  onReadPress,
  onSharePress,
  onCopyPress,
}) => {
  const [isToolbarVisible, setIsToolbarVisible] = useState(false);
  const [isToolbarClosing, setIsToolbarClosing] = useState(false);
  const iconSpin = useState(new Animated.Value(0))[0]; // Initial value for opacity: 0

  const spin = iconSpin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const handleToolbarAction = useCallback(() => {
    setIsToolbarClosing(true);
    Animated.timing(iconSpin, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setIsToolbarVisible(false);
      setIsToolbarClosing(false);
    });
  }, [iconSpin]);

  const handleReadPress = () => {
    onReadPress && onReadPress();
    handleToolbarAction();
  };

  const handleSharePress = () => {
    onSharePress && onSharePress();
    handleToolbarAction();
  };

  const handleCopyPress = () => {
    onCopyPress && onCopyPress();
    handleToolbarAction();
  };

  const onPress = () => {
    if (!isToolbarClosing) {
      setIsToolbarVisible(!isToolbarVisible);
      Animated.timing(iconSpin, {
        toValue: isToolbarVisible ? 0 : 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <View>
      {isToolbarVisible && (
        <Toolbar
          onReadPress={handleReadPress}
          onSharePress={handleSharePress}
          onCopyPress={handleCopyPress}
        />
      )}
      <Animated.View style={{transform: [{rotate: spin}]}}>
        <SmallButton
          iconName={isToolbarVisible ? 'close' : 'add'}
          onPress={onPress}
        />
      </Animated.View>
    </View>
  );
};

export default ToolbarButton;
