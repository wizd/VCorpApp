import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Dimensions, EmitterSubscription} from 'react-native';
import * as RNFS from 'react-native-fs';
import Video from 'react-native-video';
import SmallButton from './SmallButton';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {useToast} from '../../utils/useToast';

const VideoPlayer = ({videoUrl}: {videoUrl: string}) => {
  const showToast = useToast();
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

  const handleDownload = async () => {
    const localVideoPath = RNFS.DocumentDirectoryPath + '/video.mp4';

    // 下载视频
    RNFS.downloadFile({
      fromUrl: videoUrl,
      toFile: localVideoPath,
      background: true,
      begin: res => {
        console.log('Beginning video download...');
      },
      progress: res => {
        console.log(`Downloaded ${res.bytesWritten} of ${res.totalBytes}`);
      },
    })
      .promise.then(async () => {
        console.log('Video downloaded successfully!');

        // 保存视频到相册
        try {
          const saveResult = await CameraRoll.save(localVideoPath, {
            type: 'video',
          });

          showToast('已保存至相册');
          console.log('Video saved to camera roll:', saveResult);

          // 删除临时文件
          await RNFS.unlink(localVideoPath);
          console.log('Temporary video file removed.');
        } catch (err) {
          console.log('Error saving video to camera roll:', err);
        }
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  return (
    <View style={[styles.container, isFullScreen ? styles.fullScreen : {}]}>
      <Video
        source={{uri: videoUrl}}
        style={styles.video}
        resizeMode="contain"
        paused={paused}
        fullscreen={isFullScreen}
        onLoad={() => setPaused(true)}
      />
      <View style={{flexDirection: 'row'}}>
        <SmallButton
          iconName={paused ? 'play-arrow' : 'pause'}
          onPress={togglePlayPause}
        />
        <View style={styles.buttonSpacer} />
        <SmallButton iconName="file-download" onPress={handleDownload} />
        {/* <SmallButton iconName="fullscreen" onPress={toggleFullScreen} /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonSpacer: {
    width: 15, // 新增
  },
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
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default VideoPlayer;
