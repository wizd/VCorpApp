import * as React from 'react';
import {useCallback, useContext} from 'react';
import {
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  Image,
  Platform,
} from 'react-native';
import {FontSize, FontFamily, Color, Border, Padding} from '../../GlobalStyles';
import AppContext from '../persist/AppContext';
import {imgPlaceHolder, isNullOrEmpty} from '../utils/util';
import Markdown from './Markdown';
import SmallButton from './tools/SmallButton';
import LikeDislikeButtons from './tools/LikeDislikeButtons';
import Toast from 'react-native-toast-message';
import {useAudio} from '../persist/AudioContext';
import PlayerControls from './tools/PlayerControls';

// 关于音频播放：
// 如果是当前的消息，那么现实出控制台（停止、暂停、上一个、下一个）
// 如果不是当前的消息，那么只显示小耳朵图标，点击后加入队列，长按强行插入当前播放队列的第一个位置，然后开始播放

const AIMessage = (props: any) => {
  const {company} = useContext(AppContext);
  const [imgsrc, setImgsrc] = React.useState('');
  const [name, setName] = React.useState('');
  const [started, setStarted] = React.useState(false);
  const {addToPlayList, currentPlaying} = useAudio();

  React.useEffect(() => {
    //console.log('AIMessage useEffect msg wave url is: ', props.msg.wavurl);
    setImgsrc(
      company!.config.API_URL + '/assets/avatar/' + props.msg.veid + '.png',
    );
    setName(company?.employees.find(e => e.id === props.msg.veid)?.name || '');

    // if (company?.settings.tts && props.msg.wavurl !== undefined) {
    //   addToPlayList(props.msg.wavurl);
    // }
  }, [company, props]);

  const showToast = () => {
    Toast.show({
      type: 'success',
      position: 'top',
      text1: '',
      text2: '已重置播放进度到开头',
    });
  };

  const handleStop = () => {
    console.log('handleStop');
    if (props.onStop) {
      props.onStop(props.msg);
    }
  };

  const playResetProgress = () => {
    // if (sound) {
    //   sound.setCurrentTime(0);
    //   showToast();
    // }
  };

  const playOrPause = () => {
    addToPlayList(props.msg.wavurl);
    // if (sound) {
    //   if (sound.isPlaying()) {
    //     sound.pause();
    //   } else {
    //     sound.play();
    //   }
    // } else if (!started) {
    //   const sb = Platform.OS === 'ios' ? '' : Sound.MAIN_BUNDLE;
    //   const s = new Sound(props.msg.wavurl, sb, error => {
    //     if (error) {
    //       console.log('failed to load the sound', error);
    //       return;
    //     }
    //     setSound(s);
    //     s.play();
    //   });
    //   setStarted(true);
    // }
  };

  return (
    <View style={[styles.frameWrapper, styles.mt24]}>
      <View style={styles.container}>
        <Image
          source={{
            uri: isNullOrEmpty(imgsrc) ? imgPlaceHolder : imgsrc,
          }}
          style={styles.itemImage}
        />
        <Text style={styles.userName}>{name}</Text>
      </View>
      <View style={styles.AITalkContent}>
        <Markdown text={props.text} />
        {currentPlaying?.url === props.msg.wavurl && (
          <View style={styles.soundControl}>
            <PlayerControls />
          </View>
        )}
        {props.msg.wavurl !== undefined && (
          <View style={styles.soundMenu}>
            <SmallButton
              onPress={playOrPause}
              onLongPress={playResetProgress}
              iconName="hearing"
              color="grey"
            />
          </View>
        )}
        <View style={styles.gearMenu}>
          {props.isLoading && (
            <SmallButton onPress={handleStop} iconName="stop" />
          )}
          {!props.isLoading && <LikeDislikeButtons content={props.msg.text} />}
        </View>
        {/* <View style={styles.gearMenu}>
          {!props.isLoading && (
            <GearMenu
              onRefreshPress={onRefreshPress}
              onSettingsPress={onSettingsPress}
            />
          )}
        </View> */}
        <View>
          {props.isLoading && (
            <ActivityIndicator size="small" color="#0000ff" />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mt24: {
    marginTop: 24,
  },
  helloimFinehowCan: {
    fontSize: FontSize.size_lg,
    fontWeight: '700',
    fontFamily: FontFamily.nunitoRegular,
    color: '#000000',
    textAlign: 'left',
  },
  AITalkContent: {
    flex: 1,
    borderBottomLeftRadius: Border.br_sm,
    borderTopRightRadius: Border.br_sm,
    borderBottomRightRadius: Border.br_sm,
    backgroundColor: Color.whitesmoke_200,
    flexDirection: 'column',
    padding: Padding.p_md,
    position: 'relative',
  },
  frameWrapper: {
    alignSelf: 'stretch',
    padding: Padding.p_xs,
    justifyContent: 'center',
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 8,
  },
  gearMenu: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    zIndex: 100,
  },
  soundMenu: {
    position: 'absolute',
    top: -38,
    right: 12,
    zIndex: 100,
  },
  soundControl: {
    position: 'absolute',
    top: -38,
    right: 120,
    zIndex: 100,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    marginLeft: 8,
    fontSize: 14,
  },
});

export default AIMessage;
