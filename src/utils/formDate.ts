import dayjs from 'dayjs';
import 'dayjs/locale/ko'; // 한국어 로케일 추가

dayjs.locale('ko');

const formatDate = (dateString: string): string => {
  const dateTime = dayjs(dateString);

  if (!dateTime.isValid()) {
    return '유효하지 않은 날짜 및 시간';
  }

  return dateTime.format('YYYY년 MMMM D일 dddd');
};

export default formatDate;
