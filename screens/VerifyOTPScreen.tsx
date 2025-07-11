import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../types';
import { SERVER_IP } from '@env';

type VerifyOTPScreenProps = NativeStackScreenProps<RootStackParamList, 'VerifyOTPScreen'>;

export default function VerifyOTPScreen({ navigation, route }: VerifyOTPScreenProps) {
  const { email } = route.params;
  const [otp, setOtp] = useState('');

  const handleVerify = async () => {
    try {
      const response = await fetch(`${SERVER_IP}/email/verify_otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        Alert.alert('認証成功', 'パスワードを再設定してください');
        navigation.navigate('ResetPasswordScreen', { email, otp });
      } else {
        Alert.alert('認証エラー', data.error || '無効なコードです');
      }
    } catch (err) {
      console.error('エラー:', err);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Ionicons name="chevron-back" size={28} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>確認コードを入力してください</Text>

      <TextInput
        style={styles.input}
        placeholder="確認コード（6桁）"
        placeholderTextColor="#999"
        keyboardType="numeric"
        maxLength={6}
        autoCapitalize="none"
        value={otp}
        onChangeText={setOtp}
      />

      <TouchableOpacity style={{ marginBottom: 20, alignSelf: 'flex-end' }} onPress={() => navigation.navigate('ForgotPasswordScreen')}>
        <Text style={styles.text}>
          確認コードが届いていませんか？ <Text style={styles.resendText}>再送信する</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>確認する</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    fontSize: 16,
    color: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    backgroundColor: '#8B7CF6',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  text: {
    color: '#000000',
    fontWeight: 'normal',
    fontSize: 14,
    textAlign: 'right',
  },
  resendText: {
    color: '#3B82F6',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
