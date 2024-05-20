import {Pool} from "./pool";
import {Task} from "./task";
import {Reject, Resolve, StackOption, StackResult} from "./types";


export class Stack<T = any, R = T, E = any> {
    private events: Task<R, E>[];
    #results?: (R | null)[];
    #errors?: (E | null)[];
    readonly option?: StackOption<T>;
    private readonly callback: (item: T, index: number, resolve: Resolve<R>, reject: Reject<E>) => void;

    constructor(
        callback: (item: T, index: number, resolve: Resolve<R>, reject: Reject<E>) => void,
        option?: StackOption<T>) {
        this.events = [];
        this.callback = callback;
        this.option = option;
        if (option) {
            if (option.items) {
                this.tasks(option.items, option.timeout ?? option.timeouts);
            }
        }
    }

    task(item: T, timeout?: number) {
        if (item) {
            const type = this.option?this.option.type??'all':'all';
            this.events.push(
                new Task((resolve: any, reject: any, index: number) => {
                    this.callback(item, index, resolve, reject);
                }, this.events.length, type,timeout)
            )
        }
        return this;
    }

    tasks(items: T[], timeout?: number | number[]) {
        let _timeouts: number[] | undefined;
        if (timeout) {
            _timeouts = [];
            if (Array.isArray(timeout)) {
                _timeouts = [...timeout];
            } else if (timeout > 0) {
                for (let i = 0; i < items.length; i++) {
                    _timeouts.push(timeout);
                }
            }
        }
        if (_timeouts) {
            if (_timeouts.length != items.length) {
                throw new Error("timeout length must be equal to items length");
            }
        }
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item) {
                let _timeout: number | undefined;
                if (_timeouts != undefined) {
                    _timeout = _timeouts[i];
                }
                this.task(item, _timeout);
            }
        }
        return this;
    }

    async exec(): Promise<StackResult<R | null, E | null>> {
        const result = await new Pool(this.events).exec();
        this.events = [];
        this.#results = result.results;
        this.#errors = result.errors;
        return result;
    }

    public get results(): (R | null)[] | undefined {
        return this.#results;
    }

    public get errors(): (E | null)[] | undefined {
        return this.#errors;
    }
}
