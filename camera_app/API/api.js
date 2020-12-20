import axios from 'axios';
import { Alert } from 'react-native';
import { SERVER_IP, SERVER_PORT } from './apiAddress';

const URL = `http://${SERVER_IP}:${SERVER_PORT}`;

let tempResult = [];

export const imageTransfer = async (firstPhoto, secondPhoto, gender, mode = 'eyes') => {
  try {
    console.log('[1] Post Start!');
    const config = {
      // 보내는 파일의 타입 설정
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };

    await axios
      .post(
        URL,
        {
          label: 'Image',
          origin: firstPhoto,
          custom: secondPhoto,
          gender,
          mode,
        },
        config
      ) // 해당 URL로 POST
      .then((res) => {
        // console.log(res.data.results);
        const {
          data: {
            results: { imgID_1, imgID_2 },
            target_number,
          },
        } = res;
        const origin = `data:image/png;base64,${res && imgID_1}`;
        const after = `data:image/png;base64,${res && imgID_2}`;
        tempResult = [origin, after, target_number];
      })
      // POST의 결과(res)로부터 모델 결과 위치(res.data) 얻음
      // 이를 getResultURL 함수로 보낸다.
      .catch((err) => {
        console.log(`Post axios error: ${err}`);
        error = false;
        if ((err = ' Error: Network Error')) {
          Alert.alert('네트워크 에러😂', '다시 한번 시도해보세요!');
        } else {
          Alert.alert('사람을 찍어주세요🤣', '만약 사람이라면 눈을 조금만 더 크게 떠주세요😍');
        }
      });
    console.log('[1] Post End!');
  } catch (e) {
    console.log(`imageTransfer Error: ${e}`);
  } finally {
    const result = tempResult;
    if (result.length >= 2) {
      return result;
    } else {
      return false;
    }
  }
};
