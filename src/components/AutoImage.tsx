import React, {useState, useEffect} from 'react';
import {View, Image, StyleSheet, Dimensions} from 'react-native';

const AutoImage = (props: any) => {
  const [imageSize, setImageSize] = useState({width: 0, height: 0});

  useEffect(() => {
    const imageUrl = props.source;
    Image.getSize(
      imageUrl,
      (width, height) => {
        const screenWidth = Dimensions.get('window').width;
        const scaleFactor = width / screenWidth;
        const imageHeight = height / scaleFactor;
        setImageSize({width: screenWidth, height: imageHeight});
      },
      error => {
        console.error('Failed to load image size:', error);
      },
    );
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={{uri: props.source}}
        style={[
          styles.image,
          {width: imageSize.width, height: imageSize.height},
        ]}
      />
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
