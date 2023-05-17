import React, {useEffect, useRef} from 'react';
import {TouchableOpacity, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {playNext, playStart} from '../../persist/audio/playlistSlice';

interface PlayerControlsProps {
  isVisible: boolean;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({isVisible}) => {
  const audio = useSelector((state: any) => state.audio);
  const dispatch = useDispatch();

  const translateX = useRef(new Animated.Value(isVisible ? 0 : 100)).current;
  const opacity = useRef(new Animated.Value(isVisible ? 1 : 0)).current;

  const handlePlayPause = () => {
    dispatch(playStart());
  };

  const handleNext = () => {
    dispatch(playNext());
  };

  const handleStop = () => {
    dispatch({type: 'STOP'}); // assuming you have a STOP action
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
      <TouchableOpacity
        onPress={handleStop}
        disabled={audio.currentUrl === null}>
        <Icon
          name="stop"
          size={32}
          color={audio.currentUrl !== null ? 'black' : 'lightgrey'}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handlePlayPause}
        disabled={!audio.canPlay && audio.currentUrl === null}>
        <Icon
          name={audio.isPaused ? 'play-arrow' : 'pause'}
          size={32}
          color={
            audio.canPlay || audio.currentUrl !== null ? 'black' : 'lightgrey'
          }
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleNext}
        disabled={audio.playList.length <= 1}>
        <Icon
          name="skip-next"
          size={32}
          color={audio.playList.length > 1 ? 'black' : 'lightgrey'}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default PlayerControls;
