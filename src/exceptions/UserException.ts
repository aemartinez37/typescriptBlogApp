import { HttpException } from "./HttpException";

export class UserNotFoundException extends HttpException {
    constructor(id: number) {
        super(404, `User with id ${id} not found`);
    }
}

export class UsersNotFoundException extends HttpException {
    constructor() {
        super(404, `Users not found`);
    }
}

export class UserIncompleteDataException extends HttpException {
    constructor() {
        super(400, `Users incomplete data`);
    }
}