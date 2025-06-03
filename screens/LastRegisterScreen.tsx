import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';

export default function PetDetail() {
  const [name, setName] = useState('ヘルスくん');
  const [gender, setGender] = useState('女');

  return (
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
            <Picker.Item label="男" value="男" />
            <Picker.Item label="女" value="女" />
          </Picker>
        </View>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>決定</Text>
      </TouchableOpacity>
    </View>
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