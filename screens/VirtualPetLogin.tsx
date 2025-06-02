import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

// Definisikan tipe props yang menerima navigation
type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [emailName, setEmailName] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const fullEmail = `${emailName}@gmail.com`;
    console.log('Logging in with:', fullEmail, password);
    // xử lý đăng nhập ở đây

    const finalData = {
      email: fullEmail,
      password,
    }

    try{
          const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(finalData),
          });
    
          if(!response.ok){
            throw new Error('Failed to register!');
          }
    
          const data = await response.json();
          await AsyncStorage.setItem('token', data.token);

          Alert.alert('Login success!');
          navigation.navigate('HomeScreen');
        } catch (error) {
            if (error instanceof Error) {
              Alert.alert('エラー', error.message);
            } else {
              Alert.alert('エラー', '予期しないエラーが発生しました');
            }
        }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ログイン</Text>

      <Text style={styles.label}>メールアドレス</Text>
      <View style={styles.emailRow}>
        <TextInput
          style={styles.emailInput}
          value={emailName}
          onChangeText={setEmailName}
          placeholder="youremail@gmail.com"
        />
      </View>

      <Text style={styles.label}>パスワード</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholder="password"
      />

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>
          パスワードを忘れた方は <Text style={styles.link}>こちら</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={() => {
        handleLogin();
      }}>
        <Text style={styles.loginButtonText}>ログインする</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F0F9',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '600',
    color: '#4B3EFF',
    textAlign: 'center',
    marginBottom: 32,
  },
  label: {
    fontSize: 15,
    color: '#333',
    marginBottom: 6,
    marginTop: 18,
    fontWeight: '500',
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  emailInput: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderColor: '#D0CDE1',
    borderWidth: 1,
    fontSize: 15,
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderColor: '#D0CDE1',
    borderWidth: 1,
    fontSize: 15,
  },
  forgotPassword: {
    color: '#777',
    fontSize: 13,
    textAlign: 'right',
    marginTop: 10,
    marginBottom: 20,
  },
  link: {
    color: '#3A65FF',
    textDecorationLine: 'underline',
  },
  loginButton: {
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
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
