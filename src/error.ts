export class StackError extends Error {

    constructor(message:string) {
        super(`[StackError] ${message}`);
        Object.setPrototypeOf(this, StackError.prototype);
    }

}
