import * as React from 'react';
import {useContext} from 'react';
import {Text, StyleSheet, View, ActivityIndicator, Image} from 'react-native';
import {FontSize, FontFamily, Color, Border, Padding} from '../../GlobalStyles';
import AppContext from '../persist/AppContext';
import {imgPlaceHolder} from '../utils/util';
import GearMenu from './GearMenu';
import Markdown from './Markdown';

const AIMessage = (props: any) => {
  const {company, setCompany} = useContext(AppContext);
  const [imgsrc, setImgsrc] = React.useState('');

  React.useEffect(() => {
    setImgsrc(
      company!.config.API_URL + '/assets/avatar/' + props.msg.veid + '.png',
    );
  }, [company, props]);

  return (
    <View style={[styles.frameWrapper, styles.mt24]}>
      <Image
        source={{
          uri: imgsrc ?? imgPlaceHolder,
        }}
        style={styles.itemImage}
      />
      <View style={styles.helloimFinehowCanIHelpWrapper}>
        <Markdown text={props.text} />
        {/* <View>
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
});

export default AIMessage;
