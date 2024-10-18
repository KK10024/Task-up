const errorName = {
    badReq: "Bad Request",
    NotFound: "NOT FOUND"
} 

export class AppError extends Error {
    statusCode: number;
    name: string;
    constructor(message: string, name: string, statusCode: number) {
        super(message);
        this.name = name;
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}


// 커스텀 에러클래스 상속
export class BadReqError extends AppError { 
    constructor(message: string, name=errorName.badReq, statusCode = 400){
        super(message, name, statusCode);
    }
}
export class NotFoundError extends AppError { 
    constructor(message: string,name = "NotFound", statusCode: number = 404){
        super(message, name, statusCode);

    }
}
export class UnauthorizedError extends AppError {
    constructor(message: string, name = "", statusCode: number = 401) {
        super(message, name, statusCode);
    }
}
export class ForbiddenError extends AppError {
    constructor(message: string, name = "", statusCode: number = 403) {
        super(message, name, statusCode);
    }
}
export class InternalServerError extends AppError {
    constructor(message: string, name = "", statusCode: number = 500) {
        super(message, name = "", statusCode);
    }
}