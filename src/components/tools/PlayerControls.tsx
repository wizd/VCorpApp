import React, {useEffect, useRef} from 'react';
import {TouchableOpacity, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useAudio} from '../../persist/AudioContext';

interface PlayerControlsProps {
  isVisible: boolean;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({isVisible}) => {
  const {
    playOrPause,
    playNext,
    stop,
    playList,
    currentPlaying,
    canPlay,
    isPaused,
  } = useAudio();

  const translateX = useRef(new Animated.Value(isVisible ? 0 : 100)).current;
  const opacity = useRef(new Animated.Value(isVisible ? 1 : 0)).current;

  const handlePlayPause = () => {
    // Assuming your playOrPause function accepts a URL
    playOrPause('your-url-here');
  };

  const handleNext = () => {
    playNext();
  };

  const handleStop = () => {
    stop();
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: isVisible ? 0 : 100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: isVisible ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isVisible]);

  return (
    <Animated.View
      style={{
        flexDirection: 'row',
        transform: [{translateX: translateX}],
        opacity: opacity,
      }}>
      <TouchableOpacity onPress={handleStop} disabled={currentPlaying === null}>
        <Icon
          name="stop"
          size={32}
          color={currentPlaying !== null ? 'black' : 'lightgrey'}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handlePlayPause}
        disabled={!canPlay && currentPlaying === null}>
        <Icon
          name={isPaused ? 'play-arrow' : 'pause'}
          size={32}
          color={canPlay || currentPlaying !== null ? 'black' : 'lightgrey'}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleNext} disabled={playList.length <= 1}>
        <Icon
          name="skip-next"
          size={32}
          color={playList.length > 1 ? 'black' : 'lightgrey'}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default PlayerControls;
