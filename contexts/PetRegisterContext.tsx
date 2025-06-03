import React, { createContext, useState, ReactNode, useContext } from 'react';

type PetData = {
    pet_typeid: number;
    pet_name?: string;
    gender?: string;
};

type PetRegisterContextType = {
  petData: PetData;
  setPetData: (data: Partial<PetData>) => void;
};

const PetRegisterContext = createContext<PetRegisterContextType | undefined>(undefined);

export const PetRegisterProvider = ({ children }: { children: ReactNode }) => {
  const [petData, setPetDataState] = useState<PetData>({
    pet_typeid: 0,
  });

  const setPetData = (data: Partial<PetData>) => {
    setPetDataState(prev => ({ ...prev, ...data }));
  };

  return (
    <PetRegisterContext.Provider value={{ petData, setPetData }}>
      {children}
    </PetRegisterContext.Provider>
  );
};

export const usePetRegister = () => {
  const context = useContext(PetRegisterContext);
  if (!context) throw new Error('usePetRegister must be used inside PetRegisterProvider');
  return context;
};
