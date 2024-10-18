import { AppError, BadReqError } from "./AppError";
import  dayjs  from "dayjs";

export function KoreanTime(dateString: string | Date): Date {
    // Date 객체로 변환
    //const date = new Date(dateString);
    const date = dayjs(dateString);
    // 한국 시간으로 변환
    const koreaTimeOffset = 9 * 60 * 60 * 1000; // 9시간을 밀리초로 변환
    const koreanDate = dayjs(date.valueOf() + koreaTimeOffset);
    return new Date(koreanDate.valueOf());
}


export const calendarUtil = (startDate: string, type: string) => {
  const startDateKST = dayjs(startDate).add(9, 'hour');
  let start: string, end: string;

  switch (type) {
      case 'day':
          start = startDateKST.startOf('day').toISOString();
          end = startDateKST.add(1, 'day').startOf('day').toISOString();
          break;

      case 'week':
          start = startDateKST.startOf('day').toISOString();
          end = startDateKST.add(7, 'day').startOf('day').toISOString();
          break;

      case 'month':
          start = startDateKST.startOf('month').toISOString();
          end = startDateKST.add(1, 'month').startOf('month').toISOString();
          break;

      default:
          throw new BadReqError('잘못된 타입입니다: day, week, month');
  }

  return { start, end };
};