const errorName = {
    badReq: "Bad Request",
    notFound: "Not Found",
    unauthorized: "Unauthorized",
    Forbidden: "Forbidden",
    internal: "Internal Server Error",
    badGateway: "Bad Gateway",
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
    constructor(message: string, name = errorName.badReq, statusCode = 400){
        super(message, name, statusCode);
    }
}
export class NotFoundError extends AppError { 
    constructor(message: string,name = errorName.notFound, statusCode: number = 404){
        super(message, name, statusCode);

    }
}
export class UnauthorizedError extends AppError {
    constructor(message: string, name = errorName.unauthorized, statusCode: number = 401) {
        super(message, name, statusCode);
    }
}
export class ForbiddenError extends AppError {
    constructor(message: string, name = errorName.Forbidden, statusCode: number = 403) {
        super(message, name, statusCode);
    }
}
export class InternalServerError extends AppError {
    constructor(message: string, name = errorName.internal, statusCode: number = 500) {
        super(message, name, statusCode);
    }
}export class BadGateway extends AppError {
    constructor(message: string, name = errorName.badGateway, statusCode: number = 502) {
        super(message, name, statusCode);
    }
}