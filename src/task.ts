
export class Task{

    next: (
        resolve: (value: any | PromiseLike<any>) => void,
        reject: (reason?: any) => void
    ) => void;
    promise: Promise<any>;


    constructor(action: (
        resolve: (value: any | PromiseLike<any>) => void,
        reject: (reason?: any) => void
    ) => void) {
        this.next = (
            resolve: (value: any | PromiseLike<any>) => void,
            reject: (reason?: any) => void
        ) => {
            action(resolve, reject);
        }
        this.promise = new Promise(this.next);
    }
}
