import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';
import { usePetRegister } from '../contexts/PetRegisterContext';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ChoosePetScreen'>;
};

export default function ChoosePetScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const { petData, setPetData } = usePetRegister();

  const pets = [
    { id: 1, source: require('../assets/pet1.png') },
    { id: 2, source: require('../assets/pet3.png') },
    { id: 3, source: require('../assets/pet2.png') },
  ];

  const handleNext = () => {
    setPetData({
      ...petData,
      pet_typeid: Number(selected) || 0,
    });
    navigation.navigate('LastRegisterScreen');
  };

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
      <TouchableOpacity style={styles.button} onPress={handleNext}>
  <Text style={styles.buttonText}>選択</Text>
</TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F3FF',
    alignItems: 'center',
    justifyContent: 'center',
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
    width: 200,
    height: 200,
    resizeMode: 'contain',
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
  marginTop: 40,
  width: '100%',         
  maxWidth: 900,
  alignSelf: 'center', 
},

buttonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
  letterSpacing: 1,
},
});