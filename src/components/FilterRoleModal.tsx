// FilterRoleModal.tsx
import React, {useState} from 'react';
import {View, Text, Modal, StyleSheet} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
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
  const [hiredopen, setHiredOpen] = useState(false);

  const [category, setCategory] = useState<string | null>(null);
  const [categoryopen, setCategoryOpen] = useState(false);

  const [isFree, setIsFree] = useState<boolean | null>(null);
  const [isFreeopen, setIsFreeOpen] = useState(false);

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
            <View style={{zIndex: 107}}>
              <DropDownPicker
                items={[
                  {label: '全部', value: undefined},
                  {label: '已被雇佣', value: true},
                  {label: '未被雇佣', value: false},
                ]}
                open={hiredopen}
                setOpen={setHiredOpen}
                value={hired}
                setValue={setHired}
              />
            </View>

            <Text style={styles.label}>类别：</Text>
            <View style={{zIndex: 103}}>
              <DropDownPicker
                items={[
                  {label: '全部', value: undefined},
                  {label: '文字类助理', value: 'A'},
                  {label: '画图类助理', value: 'D'},
                  {label: '图文混合类助理', value: 'M'},
                  {label: '高级定制助理', value: 'C'},
                ]}
                open={categoryopen}
                setOpen={setCategoryOpen}
                value={category}
                setValue={setCategory}
              />
            </View>

            <Text style={styles.label}>免费还是收费：</Text>
            <View style={{zIndex: 102}}>
              <DropDownPicker
                items={[
                  {label: '全部', value: undefined},
                  {label: '免费', value: true},
                  {label: '收费', value: false},
                ]}
                open={isFreeopen}
                setOpen={setIsFreeOpen}
                value={isFree}
                setValue={setIsFree}
              />
            </View>

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
