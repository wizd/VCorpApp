import {NativeEventEmitter, NativeModules} from 'react-native';

import Tts from 'react-native-tts';

export class TextToSpeech {
  private eventEmitter: NativeEventEmitter;
  private textQueue: string[];
  private isReading: boolean;
  private minimumTextLength: number;

  constructor(minimumTextLength = 10) {
    Tts.addEventListener('tts-finish', event => {
      console.log('TTS finished successfully');
      this.eventEmitter.emit('ttsFinished', event);
    });

    Tts.addEventListener('tts-start', event => {
      console.log('TTS started');
    });

    Tts.setDefaultLanguage('zh-CN'); // en-US
    Tts.setDefaultRate(0.56);

    this.eventEmitter = new NativeEventEmitter();
    this.textQueue = [];
    this.isReading = false;
    this.minimumTextLength = minimumTextLength;

    this.eventEmitter.addListener('textGen', (text: string) => {
      this.textQueue.push(text);
      if (
        !this.isReading &&
        this.getTotalTextLength() >= this.minimumTextLength
      ) {
        this.readNext();
      }
    });

    this.eventEmitter.addListener('textEnd', () => {
      console.log('Text generation finished.');
    });

    this.eventEmitter.addListener('ttsFinished', () => {
      console.log('TTS finished.');
      this.isReading = false;
      if (this.getTotalTextLength() >= this.minimumTextLength) {
        this.readNext();
      }
    });
  }

  public emitTextGen(text: string) {
    this.eventEmitter.emit('textGen', text);
  }

  public emitTextEnd() {
    this.eventEmitter.emit('textEnd');
  }

  private readNext() {
    if (this.getTotalTextLength() < this.minimumTextLength) {
      return;
    }

    this.isReading = true;
    const text = this.textQueue.join('');
    const textToRead = text.slice(0, this.minimumTextLength);
    this.textQueue = [text.slice(this.minimumTextLength)];

    Tts.speak(textToRead);
  }

  private getTotalTextLength(): number {
    return this.textQueue.reduce((total, text) => total + text.length, 0);
  }
}
