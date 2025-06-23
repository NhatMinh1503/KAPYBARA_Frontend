import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  Modal, // Import Modal
  Pressable, // Import Pressable
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';
import { UserRegisterProvider, useUserRegister } from '../contexts/UserRegisterContext';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'NextRegisterScreen'>;
};

export default function RegisterScreen({ navigation }: Props) {
  const { setUserData } = useUserRegister();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('女性'); // Default gender to '女性'
  const [isGenderModalVisible, setGenderModalVisible] = useState(false); // State for modal visibility

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleNext = () => {
    setUserData({
      user_name: name,
      email,
      password,
      age: parseInt(age) || 0,
      gender,
    });

    navigation.navigate('NextRegisterScreen');
  };

  const selectGender = (selectedGender: string) => {
    setGender(selectedGender);
    setGenderModalVisible(false); // Close modal after selection
  };

  return (
    <UserRegisterProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F3FF' }}>
        <View style={styles.container}>
          {/* Tombol Kembali */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>

          <Text style={styles.title}>バーチャルペット にようこそ！</Text>

          {/* Nama */}
          <Text style={styles.label}>名前</Text>
          <TextInput
            style={[styles.input, focusedField === 'name' && styles.inputFocused]}
            placeholder=""
            value={name}
            onChangeText={setName}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField(null)}
          />

          {/* Alamat Email */}
          <Text style={styles.label}>メールアドレス</Text>
          <TextInput
            style={[styles.input, focusedField === 'email' && styles.inputFocused]}
            placeholder=""
            value={email}
            onChangeText={setEmail}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            keyboardType="email-address"
          />

          {/* Kata Sandi */}
          <Text style={styles.label}>パスワード</Text>
          <TextInput
            style={[styles.input, focusedField === 'password' && styles.inputFocused]}
            placeholder=""
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
          />

          {/* Usia & Jenis Kelamin */}
          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={styles.label}>年齢</Text>
              <View style={styles.ageRow}>
                <TextInput
                  style={[styles.input, focusedField === 'age' && styles.inputFocused, { flex: 1 }]}
                  placeholder=""
                  keyboardType="numeric"
                  value={age}
                  onChangeText={setAge}
                  onFocus={() => setFocusedField('age')}
                  onBlur={() => setFocusedField(null)}
                />
                <Text style={styles.unitInside}>歳</Text>
              </View>
            </View>
            <View style={styles.half}>
              <Text style={styles.label}>性別</Text>
              {/* Touchable Opacity for Gender Modal */}
              <TouchableOpacity
              style={[styles.input, styles.genderInput, { justifyContent: 'center' }]} // Reusing input styles for consistent look and centering text
              onPress={() => setGenderModalVisible(true)}
              >
              <Text style={styles.genderText}>{gender === '女性' ? '女' : '男'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Gender Selection Modal */}
          <Modal
            animationType="fade" // Can be 'none', 'slide', or 'fade'
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
                  onPress={() => selectGender('女性')}
                >
                  <Text style={styles.modalOptionText}>女</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => selectGender('男性')}
                >
                  <Text style={styles.modalOptionText}>男</Text>
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

          {/* Tombol Selanjutnya */}
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>次へ</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </UserRegisterProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F3FF',
    padding: 24,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20, // Sesuaikan posisi untuk iOS/Android
    left: 24,
    zIndex: 1, // Pastikan tombol di atas konten lain
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 28,
    color: 'black',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D0CDE1',
    fontSize: 15,
    marginBottom: 16,
    color: '#000',
  },
  inputFocused: {
    borderColor: '#8B7CF6',
    borderWidth: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 16,
  },
  half: {
    flex: 1,
  },
  ageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
 unitInside: {
  position: 'absolute',
  right: 10,
  top: '20%',
  fontSize: 16,
  color: '#000',
},

  genderInput: {
   flexDirection: 'row',
   alignItems: 'center',
   paddingHorizontal: 14, // Adjust padding as needed
 },
 genderText: {
   fontSize: 15,
   color: '#000',
   flex: 1, // Make text take available space
   textAlign: 'left', // Align text to the left
 },
  dropdownIcon: {
    marginLeft: 8,
  },
  // Styles for Modal
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
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});