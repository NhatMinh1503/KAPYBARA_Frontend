import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { loginUser } from '../services/login'; // Import the functions to hanlde Login

const LoginScreen  = () => {
  const router = useRouter();
  const [emailName, setEmailName] = useState('');
  const [password, setPassword] = useState('');
  const passwordInputRef = useRef<TextInput>(null);

  const handleLogin = async () => {
    try {
      const data = await loginUser(emailName, password);
      Alert.alert('Login success!')
      router.push('/HomeScreen')
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'An unexpected error occurred');
      }
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
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
        <TouchableOpacity onPress={() => router.push('/ForgotPasswordScreen')}>
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