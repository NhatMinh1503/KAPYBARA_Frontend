import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
  SafeAreaView,
  Modal, // Import Modal
  Pressable, // Import Pressable
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import type { RootStackParamList } from '../types';
import { PetRegisterProvider, usePetRegister } from '../contexts/PetRegisterContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the dropdown icon

type Props = NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>;

export default function PetDetail() {
  const navigation = useNavigation<Props>();
  const { petData, setPetData } = usePetRegister();
  const [name, setName] = useState('');
  const [gender, setGender] = useState('女性'); // Default gender
  const [isGenderModalVisible, setGenderModalVisible] = useState(false); // State for modal visibility

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

      const response = await fetch('http://localhost:3000/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        throw new Error(`登録に失敗しました: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      console.log(data);

      Alert.alert('登録完了', 'ペット情報が正常に登録されました。');
      navigation.navigate('IndexLogin'); // Navigate to login after successful registration
    } catch (error) {
      console.error('Error during registration:', error);
      Alert.alert('エラー', `登録中に問題が発生しました: ${(error as Error).message}`);
    }
  };

  const selectGender = (selectedGender: string) => {
    setGender(selectedGender);
    setGenderModalVisible(false); // Close modal after selection
  };

  return (
    <PetRegisterProvider>
      <SafeAreaView style={styles.safeArea}>
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

            {/* Gender Selection with Modal */}
            <TouchableOpacity
              style={styles.genderInput}
              onPress={() => setGenderModalVisible(true)}
            >
              <Text style={styles.genderText}>{gender === '女性' ? '女' : '男'}</Text>
            </TouchableOpacity>
          </View>

          {/* Gender Selection Modal */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={isGenderModalVisible}
            onRequestClose={() => {
              setGenderModalVisible(!isGenderModalVisible);
            }}
          >
            <Pressable
              style={styles.centeredView}
              onPress={() => setGenderModalVisible(false)} // Close modal when pressing outside
            >
              <View style={styles.modalView}>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => selectGender('男性')}
                >
                  <Text style={styles.modalOptionText}>男</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => selectGender('女性')}
                >
                  <Text style={styles.modalOptionText}>女</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalOption, styles.cancelButton]}
                  onPress={() => setGenderModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>キャンセル</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Modal>

          <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={!name.trim()}>
            <Text style={styles.buttonText}>決定</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </PetRegisterProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F3FF',
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#000',
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
  },
  nameInput: {
    flex: 0.65,
    height: 50,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D0CDE1',
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#000',
  },
  // New styles for gender input (replaces pickerBox and picker)
  genderInput: {
    flex: 0.3, // Match the old pickerBox flex
    height: 50,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D0CDE1',
    borderRadius: 8,
    justifyContent: 'center', // Center the text vertically
    alignItems: 'center', // Center the text horizontally
    paddingHorizontal: 10, // Add some padding
  },
  genderText: {
    fontSize: 16, // Match nameInput font size
    color: '#000',
  },
  // Styles for Modal (reused from previous example, adjusted slightly)
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Dim background
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%', // Adjust width as needed
  },
  modalOption: {
    padding: 10,
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalOptionText: {
    fontSize: 18,
    color: '#333',
  },
  cancelButton: {
    marginTop: 10,
    borderBottomWidth: 0, // No border for cancel button
  },
  cancelButtonText: {
    fontSize: 18,
    color: '#FF6347', // A different color for cancel for emphasis
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#8B7CF6',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
    maxWidth: 900,
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});