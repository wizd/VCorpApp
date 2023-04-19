// FilterRoleModal.tsx
import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Modal, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import CustomButton from './tools/CustomButton';

interface FilterRoleModalProps {
  isVisible: boolean;
  onClose: () => void;
  onFilter: (
    hired: boolean | null,
    category: string | null,
    isFree: boolean | null,
  ) => void;
}

const FilterRoleModal: React.FC<FilterRoleModalProps> = ({
  isVisible,
  onClose,
  onFilter,
}) => {
  const [hired, setHired] = useState<boolean | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [isFree, setIsFree] = useState<boolean | null>(null);

  const handleFilter = () => {
    onFilter(hired, category, isFree);
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
          <View style={styles.header}>
            <Text style={styles.title}>筛选助理角色</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.label}>是否已被雇佣：</Text>
            <Picker
              selectedValue={hired}
              style={styles.picker}
              onValueChange={itemValue => setHired(itemValue)}>
              <Picker.Item label="全部" value={null} />
              <Picker.Item label="已被雇佣" value={true} />
              <Picker.Item label="未被雇佣" value={false} />
            </Picker>

            <Text style={styles.label}>类别：</Text>
            <Picker
              selectedValue={category}
              style={styles.picker}
              onValueChange={itemValue => setCategory(itemValue)}>
              <Picker.Item label="全部" value={null} />
              <Picker.Item label="文字类助理" value="A" />
              <Picker.Item label="画图类助理" value="D" />
              <Picker.Item label="图文混合类助理" value="M" />
              <Picker.Item label="高级定制助理" value="C" />
            </Picker>

            <Text style={styles.label}>免费还是收费：</Text>
            <Picker
              selectedValue={isFree}
              style={styles.picker}
              onValueChange={itemValue => setIsFree(itemValue)}>
              <Picker.Item label="全部" value={null} />
              <Picker.Item label="免费" value={true} />
              <Picker.Item label="收费" value={false} />
            </Picker>

            <View style={styles.buttonsContainer}>
              <CustomButton title="取消" onPress={onClose} />
              <CustomButton title="筛选" onPress={handleFilter} />
            </View>
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
    width: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    padding: 10,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    padding: 10,
  },
});

export default FilterRoleModal;
