import React, {useState, useEffect, Platform} from 'react';
import {TouchableOpacity, Text} from 'react-native';
import AudioRecord from 'react-native-audio-record';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';

type RecordButtonProps = {
  onRecordComplete: (audioFile: string) => void;
};

const RecordButton: React.FC<RecordButtonProps> = ({onRecordComplete}) => {
  const [recording, setRecording] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const init = async () => {
      const options = {
        sampleRate: 16000,
        channels: 1,
        bitsPerSample: 16,
        wavFile: 'test.wav',
      };

      await AudioRecord.init(options);
      console.log('AudioRecord is initialized.');
    };

    init();
  }, []);

  const requestMicrophonePermission = async () => {
    const microphonePermission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.MICROPHONE
        : PERMISSIONS.ANDROID.RECORD_AUDIO;
    const result = await request(microphonePermission);
    return result === RESULTS.GRANTED;
  };

  const startRecording = async () => {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      console.log('Microphone permission denied');
      return;
    }

    setRecording(true);
    AudioRecord.start();

    // Stop recording after 2 minutes
    const id = setTimeout(() => {
      stopRecording();
    }, 2 * 60 * 1000);

    setTimeoutId(id);
  };

  const stopRecording = async () => {
    if (!recording) return;

    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }

    const audioFile = await AudioRecord.stop();
    setRecording(false);

    onRecordComplete(audioFile);
  };

  return (
    <TouchableOpacity
      onPressIn={startRecording}
      onPressOut={stopRecording}
      style={{
        padding: 5,
        backgroundColor: 'lightgray',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{fontSize: 20}}>
        {recording ? '正在录音......' : '按住 说话'}
      </Text>
    </TouchableOpacity>
  );
};

export default RecordButton;
