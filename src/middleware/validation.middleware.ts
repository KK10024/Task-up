import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';

// 제네릭을 사용하여 매개변수가 있는 생성자 지원
export const validateDto = <T>(dtoClass: new () => T) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        // DTO 인스턴스 생성, req.body의 값을 기반으로 할당
        const dto = Object.assign(new dtoClass(), req.body);

        // 유효성 검사
        const errors = await validate(dto);
        if (errors.length > 0) {
             res.status(400).send({
                success: false,
                message: '입력값 에러',
                errors: errors.map(error => ({
                    property: error.property,
                    constraints: error.constraints
                }))
            });
        }

        // 유효성 검사를 통과하면 다음 미들웨어로 진행
        next();
    };
};