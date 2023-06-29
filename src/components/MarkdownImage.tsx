// MarkdownImage.tsx
import React, {FC} from 'react';
import {Image, StyleSheet} from 'react-native';
import ImageSaver from './ImageSaver';

interface MarkdownImageProps {
  alt: string;
  source: string;
}

const MarkdownImage: FC<MarkdownImageProps> = ({alt, source}) => {
  console.log('markdown image source is:', source);
  return (
    // <Image
    //   style={styles.image}
    //   source={{uri: source}}
    //   resizeMode="contain"
    //   accessible
    //   accessibilityLabel={alt}
    // />
    <ImageSaver source={{uri: source}} />
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
});

export default MarkdownImage;
