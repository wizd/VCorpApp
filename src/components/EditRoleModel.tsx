// EditRoleModal.tsx
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';

interface EditRoleModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (name: string, description: string) => void;
  roleName: string;
  roleDescription: string;
}

const EditRoleModal: React.FC<EditRoleModalProps> = ({
  isVisible,
  onClose,
  onSave,
  roleName,
  roleDescription,
}) => {
  const [name, setName] = useState(roleName);
  const [description, setDescription] = useState(roleDescription);

  const handleSave = () => {
    onSave(name, description);
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      onRequestClose={onClose}
      animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.container}>
          <Text style={styles.title}>编辑角色</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="名字"
            autoFocus
          />
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="特别嘱咐"
            multiline
          />
          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={onClose} style={styles.button}>
              <Text>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={styles.button}>
              <Text>保存</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 10,
  },
});

export default EditRoleModal;
