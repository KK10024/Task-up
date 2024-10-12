export function KoreanTime(dateString: string | Date): Date {
    // Date 객체로 변환
    const date = new Date(dateString);
    // 한국 시간으로 변환
    const koreaTimeOffset = 9 * 60 * 60 * 1000; // 9시간을 밀리초로 변환
    const koreanDate = new Date(date.getTime() + koreaTimeOffset);
    return koreanDate;
}