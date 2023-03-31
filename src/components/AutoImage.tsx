import React, {useState, useEffect, FC} from 'react';
import {View, Image, StyleSheet, Text} from 'react-native';
import {imgPlaceHolder, isNullOrEmpty} from '../utils/util';
export interface AutoImageProps {
  source: string;
}

const AutoImage: FC<AutoImageProps> = ({source}) => {
  const [imageSize, setImageSize] = useState({width: 300, height: 300});
  const [contwidth, setContwidth] = useState(0);

  const onLayout = event => {
    const {width: containerWidth} = event.nativeEvent.layout;
    setContwidth(containerWidth);
    //console.log('in auto image onLayout, container width is: ', containerWidth);
  };

  useEffect(() => {
    if (contwidth > 0 && !isNullOrEmpty(source)) {
      const imageSource = source;

      Image.getSize(
        imageSource,
        (width, height) => {
          const scaleFactor = width / contwidth;
          const imageHeight = height / scaleFactor;

          setImageSize({width: contwidth, height: imageHeight});
        },
        error => {
          console.error('Failed to get image size:', error);
        },
      );
    }
  }, [contwidth, source]);

  return (
    <View style={styles.container} onLayout={onLayout}>
      {!isNullOrEmpty(source) && (
        <Image
          source={{
            uri: isNullOrEmpty(source) ? imgPlaceHolder : source,
          }}
          style={[
            styles.image,
            {width: imageSize.width, height: imageSize.height},
          ]}
        />
      )}
      {isNullOrEmpty(source) && <Text>等待加载...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'contain',
  },
});

export default AutoImage;
