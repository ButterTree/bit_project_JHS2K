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
        '딥러닝, AI 기술을 통해 사진을 합성중입니다.\n',
        '사용자가 많으면 1분 이상 소요될 수 있습니다.\n',
        "2인 모드는 '첫번째 사진'에\n '두번째 사진' 쌍꺼풀이 합성됩니다.",
        '고화질 사진이라면 더 좋은 결과가 나온다는 사실.\n',
        'Tip 버튼을 참고해주세요.\n',
        '눈이 너무 작으면 오류가 나올 수 있어요.\n',
        "'쌍토끼:Lemon' 앱 에서는\n 증명사진으로 사진을 변화시킬 수 있어요.'",
      ]}
    />
  );
}
