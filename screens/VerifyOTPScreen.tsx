import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Button,
} from 'react-native';
import { NativeStackScreenProps  } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../types';

type VerifyOTPScreenProps = NativeStackScreenProps<RootStackParamList, 'VerifyOTPScreen'>;


export default function VerifyOTPSCreen({ navigation, route }: VerifyOTPScreenProps) {
    const { email }   = route.params;
    const [ otp, setOtp ] = useState('');

    const handleVerify = async () => {
        try{
            const response = await fetch('http://localhost:3000/email/verify_otp', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp }),
                });

                const data = await response.json();

                if(response.ok && data.success){
                    Alert.alert('OTP code correct!', 'Please change your password.')
                    navigation.navigate('ResetPasswordScreen', { email, otp});
                }else{
                    Alert.alert('Invalid OTP code!', data.error);
                }
            }catch(err){
                console.error('Failed to fetch data!', err);
            }
    }

    //Gita's job
     return (
    <View>
      <TextInput placeholder="Masukkan Kode OTP" onChangeText={setOtp} value={otp} />
      <Button title="Verifikasi Kode" onPress={handleVerify} />
    </View>
  );
}