import {EventEmitter} from 'events';
import Tts from 'react-native-tts';

export class TextToSpeech {
  private eventEmitter: EventEmitter;
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

    Tts.setDefaultLanguage('zh-CN');
    Tts.setDefaultRate(0.56);

    this.eventEmitter = new EventEmitter();
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
    this.textQueue = [];

    Tts.speak(text);
  }

  private getTotalTextLength(): number {
    return this.textQueue.reduce((total, text) => total + text.length, 0);
  }
}
