import { Request, Response, NextFunction } from 'express';
import { AppError } from '../util/AppError';

export const errorHandler = async (err: any, req: Request, res: Response, next: NextFunction): Promise<void> => {
    // AppError 인스턴스일 경우
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            status: 'error',
            statusCode: err.statusCode,
            message: err.message,
        });
    } else {
        // 일반 에러 처리
        const statusCode = err.status || 500; // 서버 오류
        const message = err.message || '서버 오류가 발생했습니다.';

        res.status(statusCode).json({
            status: 'error',
            statusCode,
            message,
        });
    }
};
