import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons
import { SafeAreaView } from 'react-native-safe-area-context'; // Import SafeAreaView
import type { RootStackParamList } from '../types';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [emailName, setEmailName] = useState('');
  const [password, setPassword] = useState('');
  const passwordInputRef = useRef<TextInput>(null);

  const handleLogin = async () => {
    const fullEmail = `${emailName}@gmail.com`;

    const finalData = {
      email: fullEmail,
      password,
    };

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });

      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user_id', data.user_id.toString());
        console.log(data.user_id);
        Alert.alert('Login success!');
        navigation.navigate('HomeScreen');
      } else {
        // Use the error message from the backend if available, otherwise a generic message
        const errorMessage = data.message || 'Login failed!';
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'An unexpected error occurred');
      }
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Tombol kembali */}
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Ionicons name="chevron-back" size={28} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>ログイン</Text>

      <Text style={styles.label}>メールアドレス</Text>
      <View style={styles.emailRow}>
        <TextInput
          style={styles.emailInput}
          value={emailName}
          onChangeText={setEmailName}
          placeholder=""
          returnKeyType="next"
          onSubmitEditing={() => passwordInputRef.current?.focus()}
        />
      </View>

      <Text style={styles.label}>パスワード</Text>
      <TextInput
        ref={passwordInputRef}
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholder=""
        returnKeyType="done"
        onSubmitEditing={handleLogin}
      />

      <View style={styles.forgotPasswordRow}>
        <Text style={styles.forgotPasswordText}>パスワードを忘れた方は </Text>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordScreen')}>
          <Text style={styles.link}>こちら</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>ログインする</Text>
      </TouchableOpacity>
    </SafeAreaView>
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
  backButton: { // Tambahkan gaya untuk tombol kembali
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: '600',
    color: '#8B7CF6',
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
    backgroundColor: '#8B7CF6',
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
  forgotPasswordRow: {
  flexDirection: 'row',
  justifyContent: 'flex-end',  
  alignItems: 'center',
  marginTop: 10,
  marginBottom: 20,
},
forgotPasswordText: {
  color: '#777',
  fontSize: 13,
},
});