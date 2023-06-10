import React from 'react';
import {Text, Linking, StyleSheet, TouchableOpacity} from 'react-native';
import {FontFamily, FontSize} from '../../../GlobalStyles';
import ImageSaver from '../ImageSaver';

interface ClickableLinksProps {
  content: string;
}

const findLinks = (text: string) => {
  const urlPattern = /(https?:\/\/[^\s]+[^.,)"'\s])/g;
  return text.split(urlPattern);
};

const handleLinkPress = (url: string) => {
  Linking.openURL(url);
};

const ClickableLinks: React.FC<ClickableLinksProps> = ({content}) => {
  const textParts = findLinks(content);

  return (
    <Text style={styles.container} selectable={true}>
      {textParts.map((part, index) => {
        if (index % 2 === 1) {
          if (part.endsWith('.png')) {
            return <ImageSaver key={index} source={{uri: part}} />;
          } else {
            return (
              <Text
                key={index}
                selectable={true}
                style={[styles.link, styles.text]}
                onPress={() => handleLinkPress(part)}>
                {part}
              </Text>
            );
          }
        } else {
          return (
            <Text
              key={index}
              selectable={true}
              style={[styles.helloChatgpthowAre, styles.text]}>
              {part}
            </Text>
          );
        }
      })}
    </Text>
  );
};

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: 20,
  },
  text: {
    fontSize: 16,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  helloChatgpthowAre: {
    fontSize: FontSize.size_lg,
    fontWeight: '700',
    fontFamily: FontFamily.nunitoMedium,
    textAlign: 'left',
    color: '#333333',
  },
});

export default ClickableLinks;
