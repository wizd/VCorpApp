import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  EmitterSubscription,
} from 'react-native';
import Video from 'react-native-video';

const VideoPlayer = ({videoUrl}: {videoUrl: string}) => {
  const [paused, setPaused] = useState(false);
  const [isFullScreen, setFullScreen] = useState(false);

  const handleDimensionChange = () => {
    setFullScreen(!isFullScreen);
  };

  useEffect(() => {
    // 监听 Dimensions 变化
    const dimensionsSubscription: EmitterSubscription =
      Dimensions.addEventListener('change', handleDimensionChange);

    return () => {
      // 在组件卸载时移除监听器
      dimensionsSubscription.remove();
    };
  }, [isFullScreen]);

  const toggleFullScreen = () => {
    setFullScreen(!isFullScreen);
  };

  const togglePlayPause = () => {
    setPaused(!paused);
  };

  return (
    <View style={[styles.container, isFullScreen ? styles.fullScreen : {}]}>
      <Video
        source={{uri: videoUrl}}
        style={styles.video}
        resizeMode="contain"
        paused={paused}
      />
      <TouchableOpacity
        onPress={togglePlayPause}
        style={styles.playPauseButton}>
        <Text style={styles.buttonText}>{paused ? 'Play' : 'Pause'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={toggleFullScreen}
        style={styles.fullScreenButton}>
        <Text style={styles.buttonText}>
          {isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: 200,
  },
  playPauseButton: {
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  fullScreenButton: {
    backgroundColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default VideoPlayer;
