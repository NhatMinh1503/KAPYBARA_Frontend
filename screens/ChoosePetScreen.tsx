import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App'; // Đảm bảo đường dẫn đúng

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ChoosePetScreen'>;
};

export default function SelectPet({ navigation }: Props) {
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
      <Text
        style={styles.buttonText}
        onPress={() => navigation.navigate('LastRegisterScreen')}
      >
        選択
      </Text>
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
  buttonText: {
    marginTop: 40,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#6C63FF',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
});