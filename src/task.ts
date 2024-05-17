import {Reject, Resolve} from "./types";

export type TaskAction<R,E>=(resolve:Resolve<R>, reject: Reject<E>, index: number) => void
export class Task<R,E> {

    promise: Promise<R>;
    index: number = 0;
    timeout?: number;
    resolve?: Resolve<R>;
    reject?:  Reject<E>;
    next: (resolve:Resolve<R>, reject: Reject<E>) => void;

    constructor(
        action: TaskAction<R,E>,
        index:number,
        timeout?: number
        ) {
        this.index = index;
        this.timeout = timeout;
        this.next = (resolve:Resolve<R>, reject: Reject<E>) => {
            this.resolve = resolve;
            this.reject = reject;
            action(resolve, reject, this.index);
        }
        this.promise = new Promise(this.next);
    }
    setIndex(index: number) {
        this.index = index;
        return this;
    }
}
