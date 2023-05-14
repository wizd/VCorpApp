import * as React from 'react';
import {useContext} from 'react';
import Sound from 'react-native-sound';
import {Text, StyleSheet, View, ActivityIndicator, Image} from 'react-native';
import {FontSize, FontFamily, Color, Border, Padding} from '../../GlobalStyles';
import AppContext from '../persist/AppContext';
import {imgPlaceHolder, isNullOrEmpty} from '../utils/util';
import GearMenu from './GearMenu';
import Markdown from './Markdown';
import StopButton from './tools/StopButton';
import LikeDislikeButtons from './tools/LikeDislikeButtons';

const AIMessage = (props: any) => {
  const {company, setCompany} = useContext(AppContext);
  const [imgsrc, setImgsrc] = React.useState('');
  const [name, setName] = React.useState('');
  const [sound, setSound] = React.useState<Sound | null>(null);

  React.useEffect(() => {
    //console.log('AIMessage useEffect msg wave url is: ', props.msg.wavurl);
    setImgsrc(
      company!.config.API_URL + '/assets/avatar/' + props.msg.veid + '.png',
    );
    setName(company?.employees.find(e => e.id === props.msg.veid)?.name || '');
  }, [company, props]);

  const handleStop = () => {
    console.log('handleStop');
    if (props.onStop) {
      props.onStop(props.msg);
    }
  };

  const playOrPause = () => {
    if (sound) {
      if (sound.isPlaying()) {
        sound.pause();
      } else {
        sound.play();
      }
    } else {
      const s = new Sound(props.msg.wavurl, Sound.MAIN_BUNDLE, error => {
        if (error) {
          console.log('failed to load the sound', error);
          return;
        }
        setSound(s);
        s.play();
      });
    }
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
      <View style={styles.helloimFinehowCanIHelpWrapper}>
        <Markdown text={props.text} />
        {props.msg.wavurl !== undefined && (
          <View style={styles.soundMenu}>
            <StopButton onPress={playOrPause} iconName="hearing" color="grey" />
          </View>
        )}
        <View style={styles.gearMenu}>
          {props.isLoading && (
            <StopButton onPress={handleStop} iconName="stop" />
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
  helloimFinehowCanIHelpWrapper: {
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
