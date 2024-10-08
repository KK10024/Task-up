import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from "express-validator";
import { AppError } from '../util/AppError';

export const validateSignup: ValidationChain[] = [
    body('name')
      .notEmpty()
      .withMessage('이름 필드는 필수값입니다.'),
    
    body('email')
      .notEmpty()
      .withMessage('이메일 필드는 필수값입니다.')
      .isEmail()
      .withMessage('유효한 이메일 주소를 입력하세요.'),
    
    body('password')
      .notEmpty()
      .withMessage('비밀번호 필드는 필수값입니다.')
      .isLength({ min: 8 })
      .withMessage('비밀번호는 최소 8자 이상이어야 합니다.'),
  ];
  
  export const handleValidationResult = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new AppError('Validation Error', 400);
        return next(error);
    }

    next(); // 다음 미들웨어로 넘어가기
};