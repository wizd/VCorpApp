import React, {RefObject} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  TextInputProps,
  TextStyle,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface InputWithClearProps extends TextInputProps {
  inputRef?: RefObject<TextInput>;
  onChangeText: (text: string) => void;
  inputStyle?: TextStyle;
  initialValue: string;
}

const InputWithClear: React.FC<InputWithClearProps> = ({
  inputRef,
  inputStyle,
  initialValue,
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
    //flex: 1,
    //padding: 10,
  },
  clearButton: {
    paddingRight: 10,
  },
});

export default InputWithClear;
