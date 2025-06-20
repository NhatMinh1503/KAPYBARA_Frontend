import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types'; // Sesuaikan jalur file types Anda
import { UserRegisterProvider, useUserRegister } from '../contexts/UserRegisterContext';
import { Ionicons } from '@expo/vector-icons'; // Untuk ikon panah kembali

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'NextRegisterScreen'>;
};

export default function RegisterScreen({ navigation }: Props) {
  const { setUserData } = useUserRegister();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('女性');

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
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={gender}
                  onValueChange={(itemValue) => setGender(itemValue)}
                  style={styles.picker}
                  dropdownIconColor="#333"
                  mode="dropdown"
                >
                  <Picker.Item label="女" value="女性" />
                  <Picker.Item label="男" value="男性" />
                  <Picker.Item label="その他" value="その他" />
                </Picker>
              </View>
            </View>
          </View>

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
    fontSize: 14,
    color: '#000',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D0CDE1',
    borderRadius: 8,
    height: Platform.OS === 'ios' ? 50 : 48,
    justifyContent: 'center',
    paddingHorizontal: Platform.OS === 'ios' ? 6 : 0,
    overflow: 'hidden',
  },
  picker: {
    height: Platform.OS === 'ios' ? 180 : 48,
    width: '100%',
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