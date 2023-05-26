import React, {RefObject} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  TextInputProps,
  TextStyle,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface InputWithClearProps extends TextInputProps {
  inputRef?: RefObject<TextInput>;
  onChangeText: (text: string) => void;
  inputStyle?: TextStyle;
  initialValue: string;
  handleSubmit: () => void;
}

const InputWithClear: React.FC<InputWithClearProps> = ({
  inputRef,
  inputStyle,
  initialValue,
  handleSubmit,
  ...props
}) => {
  const [text, setText] = React.useState(props.value || '');

  React.useEffect(() => {
    setText(initialValue);
  }, [initialValue]);

  const clearText = () => {
    setText('');
    props.onChangeText('');
  };

  const handleKeyDown = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => {
    if (e.nativeEvent.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        {...props}
        ref={inputRef}
        style={[styles.input, inputStyle]}
        value={text}
        onChangeText={newText => {
          setText(newText);
          props.onChangeText(newText);
        }}
        onKeyPress={handleKeyDown}
      />
      {text ? (
        <TouchableOpacity style={styles.clearButton} onPress={clearText}>
          <Icon name="close-circle" size={20} color="gray" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    //padding: 10,
    maxHeight: 200,
  },
  clearButton: {
    paddingRight: 10,
  },
});

export default InputWithClear;
