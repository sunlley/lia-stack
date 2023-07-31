import {Pool} from "./pool";
import {Task} from "./task";

export interface StackResult{
    results:any[],
    errors:any[]
}
export class Stack<T> {
    private events: any[];
     #results?: any[];
     #errors?: any[];
    private readonly callback: (
        item: T,
        resolve: (value: any | PromiseLike<any>) => void,
        reject: (reason?: any) => void
    ) => void;

    constructor(callback: (
        item: T,
        resolve: (value: any | PromiseLike<any>) => void,
        reject: (reason?: any) => void
    ) => void, items?: T[]) {
        this.events = [];
        this.callback = callback;
        if (items) {
            this.tasks(items);
        }
    }

    task(item: T) {
        this.events.push(
            new Task((resolve: any, reject: any) => {
                this.callback(item, resolve, reject);
            })
        )
        return this;
    }

    tasks(items: T[]) {
        for (const item of items) {
            this.events.push(
                new Task((resolve: any, reject: any) => {
                    this.callback(item, resolve, reject);
                })
            )
        }
        return this;
    }

    async exec():Promise<StackResult> {
        let result = await new Pool(this.events).exec();
        this.events = [];
        this.#results = result.results;
        this.#errors = result.errors;
        return result;
    }

    public get results():any[]|undefined{return this.#results;}

    public get errors():any[]|undefined{return this.#errors;}
}
