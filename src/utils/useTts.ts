import {useEffect, useState} from 'react';
import {TextToSpeech} from './TextToSpeech';

interface UseTtsOptions {
  isEnabled: boolean;
}

export const useTts = ({isEnabled}: UseTtsOptions) => {
  const [tts, setTts] = useState<TextToSpeech | null>(null);

  useEffect(() => {
    if (isEnabled) {
      setTts(new TextToSpeech(10));
    } else {
      setTts(null);
    }
  }, [isEnabled]);

  const beginReading = (text: string) => {
    if (isEnabled && tts) {
      tts.emitTextGen(text);
    }
  };

  const endReading = () => {
    if (isEnabled && tts) {
      tts.emitTextEnd();
    }
  };

  return {
    beginReading,
    endReading,
  };
};
