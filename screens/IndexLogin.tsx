import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types'; // hoặc từ '../types' nếu tách riêng

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'VirtualPetLogin'>;
};

export default function VitualPetLogin({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Virtual Pet</Text>
      <Text style={styles.description}>ペットと一緒に、健康的な毎日を楽しもう！</Text>
      <Image
        source={require('../assets/rabbit.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('VirtualPetLogin')}
      >
        <Text style={styles.buttonText} onPress={() => navigation.navigate('VirtualPetLogin')}>ログイン</Text>
      </TouchableOpacity>
      <View style={styles.linkContainer}>
        <Text style={styles.linkText}>はじめての方はこちら</Text>
        <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
          <Text style={[styles.linkText, styles.registerLink]}>アカウント登録</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F3FF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#8B7CF6',
    paddingVertical: 12,
    paddingHorizontal: 48,
    borderRadius: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkContainer: {
    flexDirection: 'row',
  },
  linkText: {
    fontSize: 14,
    color: '#666',
  },
  registerLink: {
    color: '#5A80F0',
    textDecorationLine: 'underline',
  },
});