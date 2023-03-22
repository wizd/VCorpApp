import {EventEmitter} from 'events';
import Tts from 'react-native-tts';
import {franc} from 'franc';
import langs from 'langs';
export class TextToSpeech {
  private eventEmitter: EventEmitter;
  private textQueue: string[];
  private isReading: boolean;
  private isTextEnded: boolean;
  private isDetectNeeded: boolean;
  private minimumTextLength: number;

  constructor(minimumTextLength = 10) {
    Tts.addEventListener('tts-finish', event => {
      //console.log('TTS finished successfully');
      this.eventEmitter.emit('ttsFinished', event);
    });

    // Tts.addEventListener('tts-start', event => {
    //   console.log('TTS started');
    // });

    Tts.setDefaultLanguage('zh-CN');
    Tts.setDefaultRate(0.5);

    this.eventEmitter = new EventEmitter();
    this.textQueue = [];
    this.isReading = false;
    this.isTextEnded = true;
    this.minimumTextLength = minimumTextLength;

    this.eventEmitter.addListener('textGen', (text: string) => {
      const detect = this.isTextEnded && !this.isReading;
      this.isDetectNeeded ||= detect;

      this.textQueue.push(text);
      this.isTextEnded = false;
      if (
        !this.isReading &&
        this.getTotalTextLength() >= this.minimumTextLength
      ) {
        this.readNext();
      }
    });

    this.eventEmitter.addListener('textEnd', () => {
      console.log('Text generation finished.');
      this.isTextEnded = true;
    });

    this.eventEmitter.addListener('ttsFinished', () => {
      //console.log('TTS finished.');
      if (
        this.getTotalTextLength() >= this.minimumTextLength ||
        (this.getTotalTextLength() > 0 && this.isTextEnded)
      ) {
        this.readNext();
      } else {
        this.isReading = false;
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
    if (this.getTotalTextLength() < 1) {
      return;
    }
    this.isReading = true;
    const text = this.textQueue.join('');
    this.textQueue = [];

    console.log('reading: ', text);

    if (text?.length > 8 && this.isDetectNeeded) {
      const detectedLanguageCode = franc(text);
      console.log('language detected as: ', detectedLanguageCode);
      if (detectedLanguageCode === 'cmn') {
        Tts.setDefaultLanguage('zh-CN');
        Tts.setDefaultRate(0.5);
      } else {
        Tts.setDefaultLanguage('en-US');
        Tts.setDefaultRate(0.48);
      }
    }

    Tts.speak(text);
  }

  private getTotalTextLength(): number {
    return this.textQueue.reduce((total, text) => total + text.length, 0);
  }
}
