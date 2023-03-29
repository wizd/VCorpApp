import React, {useState, useEffect} from 'react';
import {View, Image, StyleSheet, Dimensions, Text} from 'react-native';

const AutoImage = (props: any) => {
  const [imageSize, setImageSize] = useState({width: 300, height: 300});
  const [contwidth, setContwidth] = useState(0);

  const onLayout = event => {
    const {width: containerWidth} = event.nativeEvent.layout;
    setContwidth(containerWidth);
    console.log('in auto image onLayout, container width is: ', containerWidth);
  };

  useEffect(() => {
    console.log(
      `in auto image useEffect, container width is ${contwidth} image src is: ${props.source}`,
    );
    if (contwidth > 0 && props.source && props.source !== '') {
      const imageSource = props.source;

      Image.getSize(
        imageSource,
        (width, height) => {
          const scaleFactor = width / contwidth;
          const imageHeight = height / scaleFactor;

          setImageSize({width: contwidth, height: imageHeight});
          console.log(
            `in auto image useEffect, image size is: ${contwidth} x ${imageHeight}}`,
          );
        },
        error => {
          console.error('Failed to get image size:', error);
        },
      );
    }
  }, [contwidth, props.source]);

  if (!props.source || props.source === '') {
    // You can return null or a placeholder component here.
    return null;
  }

  return (
    <View style={styles.container} onLayout={onLayout}>
      {props.source && props.source !== '' && (
        <Image
          source={{uri: props.source}}
          style={[
            styles.image,
            {width: imageSize.width, height: imageSize.height},
          ]}
        />
      )}
      {!props.source && <Text>等待加载...</Text>}
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
