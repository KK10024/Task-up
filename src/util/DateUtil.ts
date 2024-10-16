import { AppError } from "./AppError";

export function KoreanTime(dateString: string | Date): Date {
    // Date 객체로 변환
    const date = new Date(dateString);
    // 한국 시간으로 변환
    const koreaTimeOffset = 9 * 60 * 60 * 1000; // 9시간을 밀리초로 변환
    const koreanDate = new Date(date.getTime() + koreaTimeOffset);
    return koreanDate;
}

export const calendarUtil = (startDate: string, type: string) => {
    // 일단 검색 시 한국 시간으로 포맷 -> DB에 저장되는 값에 따라 변경 할 예정
    const startDateKST = KoreanTime(startDate);
    let start: string, end: string;
    // 들어오는 type에 따라 endDate return
    switch (type) {
      case 'day':
        start = new Date(startDateKST.getFullYear(), startDateKST.getMonth(), startDateKST.getDate()).toISOString();
        end = new Date(startDateKST.getFullYear(), startDateKST.getMonth(), startDateKST.getDate() + 1).toISOString();
        break;
  
      case 'week':
        start = new Date(startDateKST.getFullYear(), startDateKST.getMonth(), startDateKST.getDate()).toISOString();
        end = new Date(startDateKST.getFullYear(), startDateKST.getMonth(), startDateKST.getDate() + 7).toISOString();
        break;
  
      case 'month':
        start = new Date(startDateKST.getFullYear(), startDateKST.getMonth(), 1).toISOString();
        end = new Date(startDateKST.getFullYear(), startDateKST.getMonth() + 1, 0).toISOString(); // 해당 월의 마지막 날
        break;
  
      default:
        throw new AppError('잘못된 타입입니다: day, week, month', 400);
    }
  
    return { start, end };
  };