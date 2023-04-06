import ImagePicker, {Image} from 'react-native-image-picker';
import Resizer from '@bam.tech/react-native-image-resizer';

async function resizeImage(imageUri: string): Promise<string | null> {
  const MAX_SIZE = 100 * 1024;
  let quality = 90;

  let resizedImage: Image | null = null;
  let size: number;
  let base64: string | null = null;

  do {
    try {
      resizedImage = await Resizer.createResizedImage(
        imageUri,
        512,
        512,
        'PNG',
        quality,
      );
    } catch (err) {
      console.error('Failed to resize image:', err);
      return null;
    }

    const response = await fetch(resizedImage.uri);
    const blob = await response.blob();
    size = blob.size;

    // Reduce the quality by 10% and try again if the size is still larger than 100kB
    if (size > MAX_SIZE) {
      quality -= 10;
    } else {
      base64 = await blobToBase64(blob);
    }
  } while (size > MAX_SIZE && quality > 0);

  return base64;
}

function blobToBase64(blob: Blob): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        resolve(reader.result.toString());
      } else {
        reject(new Error('Failed to read blob as Base64'));
      }
    };
    reader.readAsDataURL(blob);
  });
}

export async function pickAndResizeImage() {
  ImagePicker.launchImageLibrary({}, async response => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else {
      const base64 = await resizeImage(response.uri);
      if (base64) {
        console.log('Resized image as Base64:', base64);
      } else {
        console.error('Failed to resize image');
      }
    }
  });
}
