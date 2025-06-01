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
      console.log('Form values:', form);
console.log('Final data to send:', finalData);
      const response = await fetch('http://localhost:3000/users', {
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

  return (
    <View style= {{flex:1}}>

    
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>もう少し教えてね！</Text>

        {/* <Text style={styles.label}>名前</Text>
        <TextInput
          style={styles.input}
          placeholder="ヘルスくん"
          value={form.name}
          onChangeText={(text) => handleChange('name', text)}
        />

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>年齢</Text>
            <View style={styles.inlineInput}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={form.age}
                onChangeText={(text) => handleChange('age', text)}
              />
              <Text style={styles.inlineText}>歳</Text>
            </View>
          </View>

          <View style={styles.half}>
            <Text style={styles.label}>性別</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={form.gender}
                onValueChange={(value) => handleChange('gender', value as Gender)}
              >
                <Picker.Item label="女" value="女" />
                <Picker.Item label="男" value="男" />
              </Picker>
            </View>
          </View>
        </View> */}

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>身長</Text>
            <View style={styles.inlineInput}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={form.height}
                onChangeText={(text) => handleChange('height', text)}
              />
              <Text style={styles.inlineText}>cm</Text>
            </View>
          </View>

          <View style={styles.half}>
            <Text style={styles.label}>今の体重</Text>
            <View style={styles.inlineInput}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={form.weight}
                onChangeText={(text) => handleChange('weight', text)}
              />
              <Text style={styles.inlineText}>kg</Text>
            </View>
          </View>
        </View>

        <Text style={styles.label}>目標</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={form.goal}
            onValueChange={(value) => handleChange('goal', value as Goal)}
          >
            <Picker.Item label="体重を落としたい" value="体重を落としたい" />
            <Picker.Item label="体重を増やしたい" value="体重を増やしたい" />
          </Picker>
        </View>

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>目標歩数</Text>
            <View style={styles.inlineInput}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={form.steps}
                onChangeText={(text) => handleChange('steps', text)}
              />
              <Text style={styles.inlineText}>歩</Text>
            </View>
          </View>

          <View style={styles.half}>
            <Text style={styles.label}>目標体重</Text>
            <View style={styles.inlineInput}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={form.goalWeight}
                onChangeText={(text) => handleChange('goalWeight', text)}
              />
              <Text style={styles.inlineText}>kg</Text>
            </View>
          </View>
        </View>

        <Text style={styles.label}>今の健康状態</Text>
        <View style={styles.healthOptions}>
          {(['元気', '疲れ', '病気'] as HealthStatus[]).map((status) => (
            <TouchableOpacity
              key={status}
              style={styles.healthIcon}
              onPress={() => handleHealthSelect(status)}
            >
              <Image
                source={{ uri: `https://placehold.co/60x60?text=${status}` }}
                style={[
                  styles.healthImage,
                  // form.health === status && styles.healthImageSelected
                ]}
              />
              <Text>{status}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>登録</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </View>
  );
}