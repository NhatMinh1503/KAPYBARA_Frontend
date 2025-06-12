import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
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
      user_id: storedUserId, // ユーザーIDを取得
      };

      try{
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
      }catch(error) {
        console.error('Error during registration:', error); 
    }
  }

  return (
    <PetRegisterProvider>
    <View style={styles.container}>
      <Text style={styles.title}>ペットの詳細を決めましょう</Text>

      <Image
        source={require('../assets/rabbit.png')}
        style={styles.petImage}
      />

      <View style={styles.inputRow}>
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.nameInput}
          placeholder="ペットの名前"
          placeholderTextColor="#000"
        />

        <View style={styles.pickerBox}>
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue) => setGender(itemValue)}
            style={styles.picker}
            dropdownIconColor="#000"
          >
            <Picker.Item label="男" value="男性" />
            <Picker.Item label="女" value="女性" />
          </Picker>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>決定</Text>
      </TouchableOpacity>
    </View>
    </PetRegisterProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F3FF',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  petImage: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    marginBottom: 100,
    marginTop: 100,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', 
    width: '100%',
    marginBottom: 24,
  },
  nameInput: {
    flex: 0.65,
    height: 50, 
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#000',
  },
  pickerBox: {
    flex: 0.3,
    height: 50, 
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  picker: {
    color: '#000',
  },
  button: {
    backgroundColor: '#CFC6FF',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});