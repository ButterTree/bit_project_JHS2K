import { useState } from 'react';

export const useNoticeState = () => {
  const [isNotice, setIsNotice] = useState(false);

  return {
    isNotice,
    setIsNotice,
    onPressNotice: () => (isNotice ? setIsNotice(false) : setIsNotice(true)),
  };
};
