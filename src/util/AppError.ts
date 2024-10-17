export class AppError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class BadReqError extends Error { 
    statusCode: number;
    constructor(message: string, statusCode = 400){
        super(message);
        this.statusCode = statusCode;

        Object.setPrototypeOf(this, BadReqError.prototype);
    }
}