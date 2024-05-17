import {Task} from "./task";
import {StackError} from "./error";
import {Resolve} from "./types";

export class Pool<R = any, E = any> {
    #tasks: Task<R, E>[];
    #results: (R|null)[];
    #errors: (E|null)[];
    #resultsTemp: any[];
    #errorsTemp: any[];
    #timeout?: number;

    constructor(tasks: Task<R, E>[]) {
        this.#tasks = tasks;
        this.#results = []
        this.#errors = [];
        this.#resultsTemp = []
        this.#errorsTemp = [];
        if (this.#tasks){
            this.#tasks = this.#tasks.filter((task) => task != null);
            for (let i = 0; i < this.#tasks.length; i++) {
                const task = tasks[i];
                task!.setIndex(i);
                this.#results.push(null);
                this.#errors.push(null);
            }
        }
    }

    check_result(resolve: Resolve<{
        results: (R|null)[],
        errors: (E|null)[]
    }>) {
        const length = this.#tasks.length;
        if (length === this.#resultsTemp.length + this.#errorsTemp.length) {
            resolve({results: this.#results, errors: this.#errors})
        }
    }

    async exec(): Promise<{ results: (R|null)[], errors: (E|null)[] }> {
        return  new Promise<{ results: (R|null)[], errors: (E|null)[] }>((resolve, reject) => {
            this.#resultsTemp = []
            this.#errorsTemp = [];
            if (this.#tasks == null || this.#tasks.length === 0){
                reject(new StackError('No tasks to schedule'));
            }
            for (const task of this.#tasks) {
                let timer: any;
                if (task.timeout && task.timeout > 0) {
                    timer = setTimeout(() => {
                        const error = new StackError(`Index: ${task.index} ,Time out ${task.timeout}`);
                        if (task.reject) {
                            task.reject(error as any);
                        }
                        if (timer) {
                            clearTimeout(timer);
                            timer = null;
                        }
                    }, task.timeout);
                }
                task.promise
                    .then((result) => {
                        if (timer) {
                            clearTimeout(timer);
                            timer = null;
                        }
                        this.#results[task.index] = result;
                        this.#resultsTemp.push(result);
                        this.check_result(resolve);
                    })
                    .catch((error: any) => {
                        if (timer) {
                            clearTimeout(timer);
                            timer = null;
                        }
                        this.#errors[task.index] = error;
                        this.#errorsTemp.push(error);
                        this.check_result(resolve);
                    });
            }

        });


    }
}
