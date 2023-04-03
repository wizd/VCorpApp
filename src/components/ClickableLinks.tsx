import React from 'react';
import {View, Text, Linking, StyleSheet} from 'react-native';
import {FontFamily, FontSize} from '../../GlobalStyles';

interface ClickableLinksProps {
  content: string;
}

const findLinks = (text: string) => {
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  return text.split(urlPattern);
};

const handleLinkPress = (url: string) => {
  Linking.openURL(url);
};

const ClickableLinks: React.FC<ClickableLinksProps> = ({content}) => {
  const textParts = findLinks(content);

  return (
    <View style={styles.container}>
      <Text style={styles.helloChatgpthowAre}>
        {textParts.map((part, index) => {
          if (index % 2 === 1) {
            return (
              <Text
                key={index}
                style={styles.link}
                onPress={() => handleLinkPress(part)}>
                {part}
              </Text>
            );
          } else {
            return part;
          }
        })}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
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
  },
});

export default ClickableLinks;
