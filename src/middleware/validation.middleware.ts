import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { AppError, BadReqError } from '../util/AppError';

export const validateDto = (dtoClass: any) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const dtoObject = plainToInstance(dtoClass, req.body);
        const errors = await validate(dtoObject);

        if (errors.length > 0) {
            const errorMessages = errors.map(error => Object.values(error.constraints)).flat();
            const error = new BadReqError(`Validation Error: ${errorMessages.join(', ')}`);
            return next(error);
          }
        next(); // 유효성 검사 통과 시 다음 미들웨어로 이동
    };
};