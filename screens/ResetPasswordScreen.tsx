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
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../types';

type ResetPasswordScreenProps = NativeStackScreenProps<RootStackParamList, 'ResetPasswordScreen'>;

export default function ResetPasswordScreen({ route, navigation }: ResetPasswordScreenProps) {
    const { email, otp } = route.params;
    const [ password, setPassword ] = useState('');
    const [ confirm, setConfirm ] = useState('');

    const handleReset = async () => {
        if(password !== confirm){
            Alert.alert('Password does not match!s');
            return;
        }

        try{
            const response = await fetch('http://localhost:3000/email/reset_password',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp, newPassword: password }),
            });

            if(response.ok){
                const data = await response.json();
                Alert.alert('Password changed successfully!');
                navigation.navigate('VirtualPetLogin');
            }
        }catch(err){
            console.log('Failed to reset password!');
        }
    };

    //Gita's job
     return (
    <View>
      <TextInput placeholder="Password Baru" secureTextEntry onChangeText={setPassword} value={password} />
      <TextInput placeholder="Konfirmasi Password" secureTextEntry onChangeText={setConfirm} value={confirm} />
      <Button title="Ubah Password" onPress={handleReset} />
    </View>
  );

}