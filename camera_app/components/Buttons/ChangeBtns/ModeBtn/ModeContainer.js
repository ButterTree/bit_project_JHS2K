import { useState } from 'react';

export const useModeState = () => {
  const [isMode, setIsMode] = useState('eyes');

  return {
    isMode,
    setIsMode,
  };
};
