import * as React from 'react';
import {useMemo} from 'react';
import {Pressable, Text, StyleSheet} from 'react-native';
import {FontSize, FontFamily, Color, Border} from '../../../GlobalStyles';

type QuickQuestonButtonType = {
  q: string;
  pressed: (q: string) => void;

  /** Style props */
  frame44MarginTop?: number | string;
};

const getStyleValue = (key: string, value: string | number | undefined) => {
  if (value === undefined) return;
  return {[key]: value === 'unset' ? undefined : value};
};

const QuickQuestonButton = ({
  q,
  pressed,
  frame44MarginTop,
}: QuickQuestonButtonType) => {
  const framePressableStyle = useMemo(() => {
    return {
      ...getStyleValue('marginTop', frame44MarginTop),
    };
  }, [frame44MarginTop]);

  return (
    <Pressable
      onPress={() => pressed(q)}
      style={[styles.writeATweetAboutGlobalWarWrapper, framePressableStyle]}>
      <Text style={styles.writeATweet}>{q}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  writeATweet: {
    fontSize: FontSize.size_base,
    fontWeight: '500',
    fontFamily: FontFamily.nunitoMedium,
    color: Color.darkslategray_200,
    textAlign: 'center',
    width: 284,
  },
  writeATweetAboutGlobalWarWrapper: {
    borderRadius: Border.br_md,
    backgroundColor: Color.whitesmoke_100,
    width: 317,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    flex: 1,
  },
});

export default QuickQuestonButton;
