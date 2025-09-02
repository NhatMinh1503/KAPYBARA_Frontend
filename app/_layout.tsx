import { Stack } from 'expo-router';
import { PetRegisterProvider } from '../contexts/PetRegisterContext';
import { UserRegisterProvider } from '../contexts/UserRegisterContext';

export const options = {
  headerShown: false, // <-- nonaktifkan header global
};

export default function Layout() {
  return (
    <UserRegisterProvider>
      <PetRegisterProvider>
        <Stack screenOptions={{ headerShown: false }} /> 
      </PetRegisterProvider>
    </UserRegisterProvider>
  );
}
