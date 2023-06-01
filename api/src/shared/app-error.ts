export enum HTTPStatusCodes {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,
    INTERNAL_SERVER_ERROR = 500
}

export class AppError extends Error{
    constructor(readonly statusCode: HTTPStatusCodes, readonly description: string) {
        super(description)
        this.name = HTTPStatusCodes[statusCode]
    }

    override toString = () =>
        `${this.statusCode} ${this.name} - ${this.description}`
}