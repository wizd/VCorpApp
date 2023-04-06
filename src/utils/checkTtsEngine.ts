import Tts from 'react-native-tts';

const checkTtsEngine = async (): Promise<boolean> => {
  try {
    const engines = await Tts.engines();

    if (engines.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    //console.error('Error checking TTS engines:', error);
    return false;
  }
};

export default checkTtsEngine;
