import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function VitualPetLogin() {
   const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Virtual Pet</Text>
      <Text style={styles.description}>ペットと一緒に、健康的な毎日を楽しもう！</Text>
      <Image
        source={require('../assets/loginpet.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/VirtualPetLogin')}
      >
        <Text style={styles.buttonText} onPress={() => router.push('/VirtualPetLogin')}>ログイン</Text>
      </TouchableOpacity>
      <View style={styles.linkContainer}>
        <Text style={styles.linkText}>はじめての方はこちら</Text>
        <TouchableOpacity onPress={() => router.push('/RegisterScreen')}>
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
    marginTop: 20,
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