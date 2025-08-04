import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
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
import { UserRegisterProvider, useUserRegister } from '../contexts/UserRegisterContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { setUserData } = useUserRegister();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('女性');
  const [isGenderModalVisible, setGenderModalVisible] = useState(false);

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleNext = () => {
    setUserData({
      user_name: name,
      email,
      password,
      age: parseInt(age) || 0,
      gender,
    });

    router.push('/NextRegisterScreen');
  };

  const selectGender = (selectedGender: string) => {
    setGender(selectedGender);
    setGenderModalVisible(false);
  };

  const genderOptions = [
    { label: '女', value: '女性' },
    { label: '男', value: '男性' },
  ];

  const selectedGenderLabel = genderOptions.find(opt => opt.value === gender)?.label || '';

  return (
    <UserRegisterProvider>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={28} color="#333" />
            </TouchableOpacity>

            <Text style={styles.title}>バーチャルペット にようこそ！</Text>

            <Text style={styles.label}>名前</Text>
            <TextInput
              style={[styles.input, focusedField === 'name' && styles.inputFocused]}
              placeholder=""
              value={name}
              onChangeText={setName}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
            />

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

            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={styles.label}>年齢</Text>
                <View style={styles.inputWithUnit}>
                  <TextInput
                    style={[styles.inputInner, focusedField === 'age' && styles.inputFocused]}
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
                <TouchableOpacity
                  style={styles.modalToggleButton}
                  onPress={() => setGenderModalVisible(true)}
                >
                  <Text style={gender ? styles.modalToggleTextSelected : styles.modalToggleText}>
                    {selectedGenderLabel}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#333" style={styles.dropdownIcon} />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>次へ</Text>
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
    </UserRegisterProvider>
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
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#F7F3FF',
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 80 : 40,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 24,
    zIndex: 1,
    padding: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 35,
    color: '#333',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D0CDE1',
    fontSize: 16,
    marginBottom: 16,
    color: '#000',
    height: 50,
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
  inputWithUnit: {
    position: 'relative',
    justifyContent: 'center',
    height: 50,
  },
  inputInner: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D0CDE1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    paddingRight: 36,
    color: '#000',
    fontSize: 16,
    height: '100%',
  },
  unitInside: {
    position: 'absolute',
    right: 14,
    fontSize: 14,
    color: '#666',
  },
  modalToggleButton: {
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
  modalToggleText: {
    color: '#999',
    fontSize: 16,
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
