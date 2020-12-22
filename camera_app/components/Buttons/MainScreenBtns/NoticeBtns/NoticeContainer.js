import { useState } from 'react';

export const useNoticeState = () => {
  const [isNotice, setIsNotice] = useState(true);

  return {
    isNotice,
    setIsNotice,
    onPressNotice: () => (isNotice ? setIsNotice(false) : setIsNotice(true)),
  };
};
