import React from 'react';
import LoopText from 'react-native-loop-text';

export default function Text() {
  return (
    <LoopText
      style={{
        fontSize: 15,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'black',
      }}
      delay={4000}
      textArray={[
        '딥러닝, AI 기술을 통해 사진을 합성중입니다.',
        '1인용 모드는 여성, 남성 각각 6개의\n 다른 스타일 쌍꺼풀이 랜덤하게 선택됩니다.',
        "2인용은 '첫번째 사진'에\n '두번째 사진' 쌍꺼풀이 합성됩니다.",
        '고화질 사진이 더 좋은 결과를 보여줍니다.'

      ]}
    />
  );
}
