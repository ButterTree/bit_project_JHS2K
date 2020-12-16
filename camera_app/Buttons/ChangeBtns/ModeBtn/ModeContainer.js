import { useState } from 'react';

export const useModeState = () => {
    const [isMode, setIsMode] = useState('face');

    return {
        isMode,
        setIsMode,

    };
};
