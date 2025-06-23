import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert, Platform, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import type { RootStackParamList } from '../types';
import { PetRegisterProvider, usePetRegister } from '../contexts/PetRegisterContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props =  NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>;

export default function PetDetail() {
  const navigation = useNavigation<Props>();
  const { petData, setPetData } = usePetRegister();
  const [name, setName] = useState('');
  const [gender, setGender] = useState('女性');

  const handleRegister = async () => {
    const storedUserId = await AsyncStorage.getItem('user_id');

    const fullData = {
      ...petData,
      pet_name: name, 
      gender,
      user_id: storedUserId, 
    };

    try {
      console.log('Sending data:', fullData);

      const response = await fetch('http://localhost:3000/pets', {
        method: 'POST',   
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullData),
      });
      
      if (!response.ok) {
        throw new Error('登録に失敗しました');
      }

      const data = await response.json();
      console.log(data);

      Alert.alert('登録完了', 'ユーザー情報が正常に登録されました。');
      navigation.navigate('IndexLogin'); 
    } catch(error) {
      console.error('Error during registration:', error); 
      Alert.alert('エラー', '登録中に問題が発生しました。');
    }
  };

  return (
    <PetRegisterProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>ペットの詳細を決めましょう</Text>

          <Image
            source={require('../assets/pet3.png')}
            style={styles.petImage}
          />

          <View style={styles.inputRow}>
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.nameInput}
              placeholder="ペットの名前"
              placeholderTextColor="#888"
            />

            <View style={styles.pickerBox}>
              <Picker
                selectedValue={gender}
                onValueChange={(itemValue) => setGender(itemValue)}
                style={styles.picker}
                dropdownIconColor="#000"
                mode="dropdown"
              >
                <Picker.Item label="男" value="男性" />
                <Picker.Item label="女" value="女性" />
              </Picker>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={!name.trim()}>
            <Text style={styles.buttonText}>決定</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </PetRegisterProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F3FF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F7F3FF',
    alignItems: 'center',
    justifyContent: 'center', 
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#000',
    textAlign: 'center',
  },
  petImage: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    marginTop: 20,
    marginBottom: 40,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 32,
  },
  nameInput: {
    flex: 0.65,
    height: 50,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D0CDE1',
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#000',
  },
  pickerBox: {
    flex: 0.3,
    height: 50,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D0CDE1',
    borderRadius: 8,
    justifyContent: 'center',
  },
  picker: {
    color: '#000',
    height: Platform.OS === 'ios' ? 180 : 50,
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
    width: '100%',
    maxWidth: 900,
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
