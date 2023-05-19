import * as React from 'react';
import {Text, StyleSheet, View, ActivityIndicator, Image} from 'react-native';
import {FontSize, FontFamily, Color, Border, Padding} from '../../GlobalStyles';
import {imgPlaceHolder, isNullOrEmpty} from '../utils/util';
import Markdown from './Markdown';
import SmallButton from './tools/SmallButton';
import Clipboard from '@react-native-community/clipboard';
import PlayerControls from './tools/PlayerControls';
import {useDispatch, useSelector} from 'react-redux';
import {playSound} from '../persist/slices/playlistSlice';
import {Company} from '../persist/slices/company';
import ToolbarButton from './tools/ContextButton';
import {useToast} from '../utils/useToast';

// 关于音频播放：
// 如果是当前的消息，那么现实出控制台（停止、暂停、上一个、下一个）
// 如果不是当前的消息，那么只显示小耳朵图标，点击后加入队列，长按强行插入当前播放队列的第一个位置，然后开始播放

const AIMessage = (props: any) => {
  const [imgsrc, setImgsrc] = React.useState('');
  const [name, setName] = React.useState('');
  const audio = useSelector((state: any) => state.audio);
  const dispatch = useDispatch();
  const company = useSelector((state: any) => state.company) as Company;
  const showToast = useToast();

  React.useEffect(() => {
    //console.log('AIMessage useEffect msg wave url is: ', props.msg.wavurl);
    setImgsrc(
      company!.config.API_URL + '/assets/avatar/' + props.msg.veid + '.png',
    );
    setName(company?.employees.find(e => e.id === props.msg.veid)?.name || '');
  }, [company, dispatch, props]);

  const handleStop = () => {
    console.log('handleStop');
    if (props.onStop) {
      props.onStop(props.msg);
    }
  };

  const handleCopy = () => {
    Clipboard.setString(props.msg.text);
    showToast('内容已复制到剪贴板');
  };

  const playResetProgress = () => {
    // if (sound) {
    //   sound.setCurrentTime(0);
    //   showToast();
    // }
  };

  const playOrPause = () => {
    console.log('in AIMessage, playOrPause try to add to playlist:');
    if (props.msg.wavurl) {
      dispatch(playSound(props.msg.wavurl));
    } else {
      //try tts later.
      showToast('没有找到此消息的语音');
    }
  };

  //{props.msg.wavurl !== undefined && (
  // <View style={styles.soundMenu}>
  //   <SmallButton
  //     onPress={playOrPause}
  //     onLongPress={playResetProgress}
  //     iconName="hearing"
  //     color="grey"
  //   />
  // </View>
  //)}

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

        <View style={styles.soundControl}>
          <PlayerControls
            isVisible={
              audio.currentUrl !== null &&
              audio.currentUrl !== undefined &&
              audio.currentUrl === props.msg.wavurl
            }
          />
        </View>

        <View style={styles.gearMenu}>
          {props.isLoading && (
            <SmallButton onPress={handleStop} iconName="stop" />
          )}
          {!props.isLoading && (
            <ToolbarButton
              onReadPress={playOrPause}
              onCopyPress={handleCopy}
              onSharePress={() => props.handleShare(props.msg)}
            />
          )}
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
    width: '100%',
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
    top: -42,
    right: 0,
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
