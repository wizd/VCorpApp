import React, {useState} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import SmallButton from './SmallButton'; // Assuming this is the file path
import Toolbar from './ToolBar'; // Assuming this is the file path

const ToolbarButton: React.FC = () => {
  const [isToolbarVisible, setIsToolbarVisible] = useState(false);
  const iconSpin = useState(new Animated.Value(0))[0]; // Initial value for opacity: 0

  const spin = iconSpin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const onPress = () => {
    setIsToolbarVisible(!isToolbarVisible);
    Animated.timing(iconSpin, {
      toValue: isToolbarVisible ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View>
      {isToolbarVisible && <Toolbar />}
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
