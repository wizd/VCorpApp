import React, {useState, useEffect, useRef} from 'react';
import {TouchableOpacity, Text, Platform, StyleSheet} from 'react-native';
import AudioRecord from 'react-native-audio-record';
import {PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import {toByteArray} from 'react-native-quick-base64';
import {VwsSpeechMessage} from '../../comm/wsproto';
import {readFirst44Bytes} from '../../utils/util';
import {useDispatch, useSelector} from 'react-redux';
import {ChatServerState, sendChatMessage} from '../../persist/slices/chatSlice';
import {Company} from '../../persist/slices/company';

type RecordButtonProps = {
  onRecordComplete: (msgid: string) => void;
};

const RecordButton: React.FC<RecordButtonProps> = ({onRecordComplete}) => {
  const [recording, setRecording] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const batchIdRef = useRef<number>(0);
  const [cid, setCid] = useState<number>(0);

  const dispatch = useDispatch();
  const chatState = useSelector(
    (state: any) => state.company,
  ) as ChatServerState;
  const company = useSelector((state: any) => state.company) as Company;

  useEffect(() => {
    const init = async () => {
      const options = {
        sampleRate: 16000,
        channels: 1,
        bitsPerSample: 16,
        wavFile: 'test.wav',
      };

      await AudioRecord.init(options);
      AudioRecord.on('data', data => {
        //send speech data to server via websocket
        const bytes = toByteArray(data);
        //console.log('bytes.length: ' + bytes.length);
        //console.log(bytes);

        setCid(currentCid => {
          const newCid = currentCid + 1;

          const msg: VwsSpeechMessage = {
            id: batchIdRef.current.toString(),
            src: 'app',
            dst: 'server',
            type: 'speech',
            time: new Date().getTime(),
            data: bytes,
            cid: newCid.toString(),
            final: false,
          };

          dispatch(sendChatMessage(msg));

          return newCid;
        });
      });

      console.log('AudioRecord is initialized.');
    };
    const getMicrophonePermission = async () => {
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        console.log('Microphone permission denied');
      } else {
        // Permission granted, initialize audio record
        await init();
      }
    };

    getMicrophonePermission();
  }, [dispatch]); // Empty dependency array means this runs once on mount

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

    batchIdRef.current = new Date().getTime();
    setCid(0);

    // send wav header
    // const first44Bytes = wavHeaderBytes; //.slice(0, 44);
    // const uint8Array = Uint8Array.from(first44Bytes);
    // const msg: VwsSpeechMessage = {
    //   id: batchIdRef.current.toString(),
    //   src: 'app',
    //   dst: 'server',
    //   type: 'speech',
    //   time: new Date().getTime(),
    //   data: uint8Array,
    //   cid: '0',
    //   final: false,
    // };

    // sendMessage(msg);

    setRecording(true);
    AudioRecord.start();

    // Stop recording after 2 minutes
    const id = setTimeout(() => {
      stopRecording();
    }, 2 * 60 * 1000);

    setTimeoutId(id);
  };

  const stopRecording = async () => {
    if (!recording) {
      return;
    }

    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }

    const audioFile = await AudioRecord.stop();
    setRecording(false);

    // send final speech data to server via websocket
    const newCid = cid + 1000;

    const msg: VwsSpeechMessage = {
      id: batchIdRef.current.toString(),
      src: 'app',
      dst: company.curid,
      type: 'speech',
      time: new Date().getTime(),
      data: await readFirst44Bytes(audioFile),
      cid: newCid.toString(),
      final: true,
    };
    dispatch(sendChatMessage(msg));

    onRecordComplete(msg.id);
  };

  return (
    <TouchableOpacity
      onPressIn={startRecording}
      onPressOut={stopRecording}
      style={styles.button}>
      <Text style={styles.text}>
        {recording ? '正在录音......' : '按住 说话'}
      </Text>
    </TouchableOpacity>
  );
};

export default RecordButton;

const styles = StyleSheet.create({
  button: {
    padding: 5,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});
