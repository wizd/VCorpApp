import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ArrowGuide: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [fadeAnim]);

  return (
    <View style={styles.arrowContainer}>
      <Animated.View
        style={[
          styles.arrow,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -10],
                }),
              },
            ],
          },
        ]}>
        <MaterialIcons name="south" size={100} color="blue" />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  arrowContainer: {
    position: 'absolute',
    bottom: 10,
    left: -10,
    right: 0,
    zIndex: 100,
    //justifyContent: 'left',
    //alignItems: 'center',
  },
  arrow: {
    width: 100,
    height: 140,
  },
});

export default ArrowGuide;
