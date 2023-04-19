import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

interface FormState {
  seed: number;
  style: string;
  negativePrompt: string;
  width: number;
  height: number;
}

const Text2ImgConfig: React.FC = () => {
  const [formState, setFormState] = useState<FormState>({
    seed: -1,
    style: '',
    negativePrompt: '',
    width: 512,
    height: 512,
  });

  const handleChange = (field: keyof FormState, value: string | number) => {
    setFormState(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.rowone}>
        <Text style={styles.label}>Seed:</Text>
        <TextInput
          style={styles.input}
          value={formState.seed.toString()}
          onChangeText={text => handleChange('seed', text)}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Width:</Text>
        <TextInput
          style={styles.input2}
          value={formState.width.toString()}
          onChangeText={text => handleChange('width', text)}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Height:</Text>
        <TextInput
          style={styles.input2}
          value={formState.height.toString()}
          onChangeText={text => handleChange('height', text)}
          keyboardType="numeric"
        />
      </View>

      <Text style={styles.label}>Style:</Text>
      <TextInput
        style={styles.textArea}
        value={formState.style}
        onChangeText={text => handleChange('style', text)}
        multiline
      />

      <Text style={styles.label}>Negative Prompt:</Text>
      <TextInput
        style={styles.textArea}
        value={formState.negativePrompt}
        onChangeText={text => handleChange('negativePrompt', text)}
        multiline
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#eeeeee',
    width: '100%',
  },
  rowone: {
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
    margin: 8,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    width: 84,
    height: 24,
  },
  input2: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
    width: 44,
    height: 24,
  },
  textArea: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    textAlignVertical: 'top',
    height: 36,
  },
  picker: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    margin: 16,
  },
});

export default Text2ImgConfig;
