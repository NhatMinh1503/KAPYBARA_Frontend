import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { PetRegisterProvider, usePetRegister } from '../contexts/PetRegisterContext';

export default function PetDetail() {
  const router = useRouter();
  const { petData, setPetData } = usePetRegister();
  const [name, setName] = useState('');
  const [gender, setGender] = useState('女性');
  const [isGenderModalVisible, setGenderModalVisible] = useState(false);

  const genderOptions = [
    { label: '男', value: '男性' },
    { label: '女', value: '女性' },
  ];

  const handleRegister = async () => {
    const storedUserId = await AsyncStorage.getItem('user_id');

    const fullData = {
      ...petData,
      pet_name: name,
      gender,
      user_id: storedUserId,
    };

    try {
      console.log('Sending data:', fullData);

      const response = await fetch(`http://10.108.1.0:3000/pets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        Alert.alert('登録に失敗しました', `登録に失敗しました: ${errorData.message || response.statusText}`);
        return;
      }

      const data = await response.json();
      console.log(data);

      Alert.alert('登録完了', 'ペット情報が正常に登録されました。');
      router.push('/IndexLogin');
    } catch (error) {
      console.error('Error during registration:', error);
      Alert.alert('エラー', `登録中に問題が発生しました: ${(error as Error).message}`);
    }
  };

  const selectGender = (selectedGender: string) => {
    setGender(selectedGender);
    setGenderModalVisible(false);
  };

  const selectedGenderLabel = gender === '女性' ? '女' : '男';

  return (
    <PetRegisterProvider>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.container}>
            <Text style={styles.title}>ペットの詳細を決めましょう</Text>

            <Image
              source={require('../assets/pet3.png')}
              style={styles.petImage}
            />

            <View style={styles.inputRow}>
              <TextInput
                value={name}
                onChangeText={setName}
                style={styles.nameInput}
                placeholder="ペットの名前"
                placeholderTextColor="#888"
              />

              <TouchableOpacity
                style={styles.modalToggleButton}
                onPress={() => setGenderModalVisible(true)}
              >
                <Text style={styles.modalToggleTextSelected}>
                  {selectedGenderLabel}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#333" style={styles.dropdownIcon} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={!name.trim()}>
              <Text style={styles.buttonText}>決定</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isGenderModalVisible}
          onRequestClose={() => setGenderModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>性別を選択してください</Text>
              {genderOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalOption}
                  onPress={() => selectGender(option.value)}
                >
                  <Text style={styles.modalOptionText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setGenderModalVisible(false)}
              >
                <Text style={styles.modalCloseButtonText}>キャンセル</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </PetRegisterProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F3FF',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#F7F3FF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 35,
    color: '#333',
    textAlign: 'center',
  },
  petImage: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    marginTop: 20,
    marginBottom: 40,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 32,
    gap: 16,
  },
  nameInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D0CDE1',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#000',
  },
  modalToggleButton: {
    flex: 0.5,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D0CDE1',
    borderRadius: 10,
    height: 50,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  modalToggleTextSelected: {
    color: '#000',
    fontSize: 16,
  },
  dropdownIcon: {
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#8B7CF6',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
    width: '100%',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1.2,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    width: '85%',
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  modalOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 17,
    color: '#333',
  },
  modalCloseButton: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: '#E8E0FF',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B7CF6',
  },
});
