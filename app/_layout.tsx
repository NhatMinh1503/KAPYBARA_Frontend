import { Stack } from 'expo-router';
import { PetRegisterProvider } from '../contexts/PetRegisterContext';
import { UserRegisterProvider } from '../contexts/UserRegisterContext';

export default function Layout() {
  return (
    <UserRegisterProvider>
      <PetRegisterProvider>
        <Stack />
      </PetRegisterProvider>
    </UserRegisterProvider>
  );
}