import {Pool} from "./pool";
import {Task} from "./task";

export interface StackResult {
    results: any[],
    errors: any[]
}
export interface StackOption<T>{
    items?:T[]
    timeout?:number;
}
export class Stack<T> {
    private events: any[];
    #results?: any[];
    #errors?: any[];
    #timeout?: number;
    private readonly callback: (
        item: T,
        index: number,
        resolve: (value: any | PromiseLike<any>) => void,
        reject: (reason?: any) => void
    ) => void;

    constructor(
        callback: (
            item: T,
            index: number,
            resolve: (value: any | PromiseLike<any>) => void,
            reject: (reason?: any) => void) => void,
        option?: StackOption<T>) {
        this.events = [];
        this.callback = callback;
        if (option){
            if (option.items) {
                this.tasks(option.items);
            }
            if (option.timeout && option.timeout>0) {
                this.timeout(option.timeout);
            }
        }
    }

    task(item: T) {
        this.events.push(
            new Task((resolve: any, reject: any, index: number) => {
                this.callback(item, index, resolve, reject);
            })
        )
        return this;
    }

    tasks(items: T[]) {
        for (const item of items) {
            this.task(item);
        }
        return this;
    }

    timeout(time: number) {
        this.#timeout = time;
        return this;
    }

    async exec(): Promise<StackResult> {
        const result = await new Pool(this.events).exec(this.#timeout);
        this.events = [];
        this.#results = result.results;
        this.#errors = result.errors;
        return result;
    }

    public get results(): any[] | undefined {
        return this.#results;
    }

    public get errors(): any[] | undefined {
        return this.#errors;
    }
}
