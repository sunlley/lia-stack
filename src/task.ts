
export class Task{

    next: (
        resolve: (value: any | PromiseLike<any>) => void,
        reject: (reason?: any) => void
    ) => void;
    promise: Promise<any>;
    index:number=0;
    resolve?: (value: any | PromiseLike<any>) => void;
    reject?: (reason?: any) => void;


    constructor(action: (
        resolve: (value: any | PromiseLike<any>) => void,
        reject: (reason?: any) => void,
        index:number
    ) => void) {
        this.next = (
            resolve: (value: any | PromiseLike<any>) => void,
            reject: (reason?: any) => void
        ) => {
            this.resolve=resolve;
            this.reject=reject;
            action(resolve, reject,this.index);
        }
        this.promise = new Promise(this.next);
    }
}
