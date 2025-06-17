import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types'; // Hoặc đường dẫn đến file types của bạn
import { UserRegisterProvider, useUserRegister } from '../contexts/UserRegisterContext';

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
      age: parseInt(age),
      gender,
    });

    navigation.navigate('NextRegisterScreen');
  };

  return (
    <UserRegisterProvider>
      <View style={styles.container}>
        <Text style={styles.title}>バーチャルペット にようこそ！</Text>

        {/* 名前 */}
        <Text style={styles.label}>名前</Text>
        <TextInput
          style={[styles.input, focusedField === 'name' && styles.inputFocused]}
          placeholder=""
          value={name}
          onChangeText={setName}
          onFocus={() => setFocusedField('name')}
          onBlur={() => setFocusedField(null)}
        />

        {/* メールアドレス */}
        <Text style={styles.label}>メールアドレス</Text>
        <View style={styles.emailRow}>
          <TextInput
          style={[styles.input, focusedField === 'email' && styles.inputFocused]}
          placeholder=""
          value={email}
          onChangeText={setEmail}
          onFocus={() => setFocusedField('email')}
          onBlur={() => setFocusedField(null)}
          keyboardType="email-address"
        />
        </View>

        {/* パスワード */}
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

        {/* 年齢・性別 */}
        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>年齢</Text>
            <View style={styles.ageRow}>
              <TextInput
                style={[styles.input, focusedField === 'age' && styles.inputFocused]}
                placeholder=""
                keyboardType="numeric"
                value={age}
                onChangeText={setAge}
                onFocus={() => setFocusedField('age')}
                onBlur={() => setFocusedField(null)}
              />
              <Text style={styles.at}>歳</Text>
            </View>
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>性別</Text>
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue) => setGender(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="女" value="女性"/>
              <Picker.Item label="男" value="男性" />
              <Picker.Item label="その他" value="その他" />
            </Picker>
          </View>
        </View>
        {/* 次へ */}
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>次へ</Text>
        </TouchableOpacity>
      </View>
    </UserRegisterProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F0FF',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 28,
    color: '#4B3EFF',
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D0CDE1',
    fontSize: 15,
    marginBottom: 16,
  },
  inputFocused: {
    borderColor: '#A78BFA',
    borderWidth: 2,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  emailInput: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D0CDE1',
    fontSize: 15,
  },
  at: {
    fontSize: 15,
    color: '#555',
    marginLeft: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 28,
  },
  half: {
    flex: 1,
  },
  ageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#D0CDE1',
    borderWidth: 1,
    height: 48,
    justifyContent: 'center',

    
  },
  button: {
    backgroundColor: '#7A6FFF',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});