<<<<<<< HEAD
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../scripts/RegisterStyles';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useUserRegister } from '../contexts/UserRegisterContext';

type Gender = '男' | '女';
type Goal = '体重を落としたい' | '体重を増やしたい';
type HealthStatus = '元気' | '疲れ' | '病気';

type RootStackParamList = {
  RegisterScreen: undefined;
  ChoosePetScreen: undefined;
  // Thêm các màn hình khác nếu có
};
type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'RegisterScreen'
>;

interface Props {
  navigation: RegisterScreenNavigationProp;
  route?: RouteProp<RootStackParamList, 'ChoosePetScreen'>;
}
interface FormState {
  height: string;
  weight: string;
  goal: Goal;
  steps: string;
  goalWeight: string;
  health: HealthStatus | '';
}

export default function RegisterScreen({navigation}:Props) {
  const { userData } = useUserRegister();

  const [form, setForm] = useState<FormState>({
    height: '',
    weight: '',
    goal: '体重を落としたい',
    steps: '',
    goalWeight: '',
    health: '',
  });

  const handleChange = <K extends keyof FormState>(name: K, value: FormState[K]) => {
    setForm({ ...form, [name]: value });
  };

  const handleHealthSelect = (status: HealthStatus) => {
    setForm({ ...form, health: status });
  };

  const handleSubmit = async () => {
    const finalData = {
      ...userData,
      height: parseInt(form.height),
      weight: parseInt(form.weight),
      goal: form.goal,
      steps: parseInt(form.steps),
      goalWeight: parseInt(form.goalWeight),
      health: form.health,
    };

    try{
      const response = await fetch('http://localhost:3000/fetch_weather', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(finalData),
      });

      if(!response.ok){
        throw new Error('Failed to register!');
      }

      const data = await response.json();
      Alert.alert('登録しました！');
    } catch (error) {
        if (error instanceof Error) {
          Alert.alert('エラー', error.message);
        } else {
          Alert.alert('エラー', '予期しないエラーが発生しました');
        }
    }
  };
=======
>>>>>>> 96a10d4514d11388336a1f0b6cdbe1a71e99ac2d

import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useState } from 'react';
 
export default function SelectPet() {
  const [selected, setSelected] = useState<number | null>(null);
 
  const pets = [
    { id: 0, source: require('../assets/rabbit.png') },
    { id: 1, source: require('../assets/rabbit.png') },
    { id: 2, source: require('../assets/rabbit.png') },
  ];
 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ペットを選びましょう</Text>
      <View style={styles.petGrid}>
        {pets.map((pet) => (
          <TouchableOpacity
            key={pet.id}
            onPress={() => setSelected(pet.id)}
            style={[
              styles.petWrapper,
              selected === pet.id && styles.selectedPet,
            ]}
          >
            <Image source={pet.source} style={styles.petImage} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F3FF',
    alignItems: 'center',
    paddingTop: 60,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  petGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 32,
    rowGap: 32,
  },
  petWrapper: {
    padding: 8,
    borderRadius: 16,
  },
  selectedPet: {
    backgroundColor: '#D9D4FF',
  },
  petImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
});