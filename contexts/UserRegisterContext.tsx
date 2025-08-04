import React, { createContext, useState, ReactNode, useContext } from 'react';

type UserData = {
  user_name: string;
  email: string;
  password: string;
  age: number;
  gender: string;
  weight?: number;
  height?: number;
  goal?: string;
  health?: string;
  steps?: number;
  goalWeight?: number;
};

type UserRegisterContextType = {
  userData: UserData;
  setUserData: (data: Partial<UserData>) => void;
};

const UserRegisterContext = createContext<UserRegisterContextType | undefined>(undefined);

export const UserRegisterProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserDataState] = useState<UserData>({
    user_name: '',
    email: '',
    password: '',
    age: 0,
    gender: '',
  });

  const setUserData = (data: Partial<UserData>) => {
    setUserDataState(prev => ({ ...prev, ...data }));
  };

  return (
    <UserRegisterContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserRegisterContext.Provider>
  );
};

export const useUserRegister = () => {
  const context = useContext(UserRegisterContext);
  if (!context) throw new Error('useUserRegister must be used inside UserRegisterProvider');
  return context;
};
