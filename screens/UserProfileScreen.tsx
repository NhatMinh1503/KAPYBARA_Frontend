import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Type definitions
type RootStackParamList = {
  IndexLogin: undefined;
  VirtualPetLogin: undefined;
  RegisterScreen: undefined;
  NextRegisterScreen: undefined;
  ChoosePetScreen: undefined;
  LastRegisterScreen:undefined;
  HomeScreen: undefined;
  ReminderScreen: undefined;
  ProgressTrackerScreen: undefined;
  DailyHealthScreen: undefined;
  UserProfileScreen: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'UserProfileScreen'>;

const UserProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('ヘルス タロウ');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('男');
  const [height, setHeight] = useState('170');
  const [weight, setWeight] = useState('65');
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);

  const onUpdatePress = () => {
    Alert.alert('更新', 'プロフィールが更新されました。');
  };

  const selectGender = (selectedGender: string) => {
    setGender(selectedGender);
    setShowGenderDropdown(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>       
        {/* Avatar Placeholder */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarPlaceholder} />
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Name Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>名前</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="名前を入力"
            />
          </View>

          {/* Email Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>メールアドレス</Text>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              placeholder="メールアドレスを入力"
              keyboardType="email-address"
            />
          </View>

          {/* Age and Gender Row */}
          <View style={styles.rowContainer}>
            <View style={styles.halfField}>
              <Text style={styles.fieldLabel}>年齢</Text>
              <TextInput
                style={styles.textInput}
                value={age}
                onChangeText={setAge}
                placeholder="年齢"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.halfField}>
              <Text style={styles.fieldLabel}>性別</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowGenderDropdown(true)}
              >
                <Text style={styles.dropdownText}>{gender}</Text>
                <Ionicons name="chevron-down" size={16} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Height and Weight Row */}
          <View style={styles.rowContainer}>
            <View style={styles.halfField}>
              <Text style={styles.fieldLabel}>身長</Text>
              <View style={styles.inputWithUnit}>
                <TextInput
                  style={styles.textInputWithUnit}
                  value={height}
                  onChangeText={setHeight}
                  placeholder="170"
                  keyboardType="numeric"
                />
                <Text style={styles.unitText}>cm</Text>
              </View>
            </View>
            <View style={styles.halfField}>
              <Text style={styles.fieldLabel}>体重</Text>
              <View style={styles.inputWithUnit}>
                <TextInput
                  style={styles.textInputWithUnit}
                  value={weight}
                  onChangeText={setWeight}
                  placeholder="65"
                  keyboardType="numeric"
                />
                <Text style={styles.unitText}>kg</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Update Button */}
        <TouchableOpacity style={styles.updateButton} onPress={onUpdatePress}>
          <Text style={styles.updateButtonText}>更新</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Gender Selection Modal */}
      <Modal
        visible={showGenderDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowGenderDropdown(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowGenderDropdown(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>性別を選択</Text>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => selectGender('男')}
            >
              <Text style={styles.modalOptionText}>男</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => selectGender('女')}
            >
              <Text style={styles.modalOptionText}>女</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

     yang bagian ini nya juga bukan hanya homescreen nya yang berwarna ini #8B7CF6 tetapi saat di tekan yang lainnya warna itu yang akan berubah      {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
              <TouchableOpacity
                style={styles.navItem}
                onPress={() => navigation.navigate('ReminderScreen')}
              >
                <Ionicons name="time-outline" size={24} color="#666" />
              </TouchableOpacity>
           
              <TouchableOpacity
                style={styles.navItem}
                onPress={() => navigation.navigate('ProgressTrackerScreen')}
              >
                <Ionicons name="stats-chart-outline" size={24} color="#666" />
              </TouchableOpacity>
           
              <TouchableOpacity
                style={styles.navItem}
                onPress={() => navigation.navigate('HomeScreen')}
              >
                <Ionicons name="home" size={24} color="#8B7CF6" />
              </TouchableOpacity>
           
              <TouchableOpacity
                style={styles.navItem}
                onPress={() => navigation.navigate('DailyHealthScreen')}
              >
                <Ionicons name="create-outline" size={24} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navItem}
                onPress={() => navigation.navigate('UserProfileScreen')}
              >
                <Ionicons name="person-outline" size={24} color="#666" />
              </TouchableOpacity>
            </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f4ff',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  profileIconContainer: {
    padding: 8,
  },
  profileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
  },
  formContainer: {
    width: '100%',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  halfField: {
    width: '48%',
  },

  dropdownButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    zIndex: 999,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  dropdownItem: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  inputWithUnit: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingRight: 15,
  },
  textInputWithUnit: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  unitText: {
    fontSize: 14,
    color: '#666',
  },
  updateButton: {
    backgroundColor: '#8B7CF6',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 30,
    shadowColor: '#8B7CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    minWidth: 200,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  modalOption: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginVertical: 5,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
  },
});
export default UserProfileScreen;