export interface StackResult<R=any,E=any> {
    results: R[],
    errors: E[]
}
export interface StackOption<T>{
    items?:T[]
    timeout?:number;
    timeouts?:number[];
}
export type Resolve<R = any> = (value: R | PromiseLike<R>) => void
export type Reject<E = any> = (reason?: E) => void