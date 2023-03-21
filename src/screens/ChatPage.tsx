import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {generateResponse} from '../chatGPTService';

const ChatPage: React.FC = () => {
  const [inputMessage, setInputMessage] = useState<string>('');
  const [responseMessage, setResponseMessage] = useState<string>('');

  const handleSubmit = async () => {
    const response = await generateResponse(inputMessage);
    setResponseMessage(response);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type your message here"
        onChangeText={setInputMessage}
        value={inputMessage}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
      <Text style={styles.response}>{responseMessage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    width: '100%',
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  response: {
    fontSize: 16,
  },
});

export default ChatPage;
