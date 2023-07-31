import {Task} from "./task";

export class Pool<T> {
     #tasks: Task[];
     #results: any[];
     #errors: any[];
     #resultsTemp: any[];
     #errorsTemp: any[];

    constructor(tasks: Task[]) {
        this.#tasks = tasks;
        this.#results = []
        this.#errors = [];
        this.#resultsTemp = []
        this.#errorsTemp = [];
    }

    check_result(resolve: (payload:any)=>void) {
        let length = this.#tasks.length;
        if (length === this.#resultsTemp.length + this.#errorsTemp.length) {
            resolve({results: this.#results, errors: this.#errors})
        } else {

        }
    }

    async exec(): Promise<{ results: any[], errors: any[] }> {
        return new Promise(
            resolve => {
                if (this.#tasks != null && this.#tasks.length > 0) {
                    for (const task of this.#tasks) {
                        this.#results.push(null);
                        this.#errors.push(null);
                    }
                    for (let i = 0; i < this.#tasks.length; i++) {
                        let task = this.#tasks[i];
                        task.index=i;
                        task.promise
                            .then((result) => {
                                this.#results[i] = result;
                                this.#resultsTemp.push(result);
                                this.check_result(resolve);
                            })
                            .catch((error: any) => {
                                this.#errors[i] = error;
                                this.#errorsTemp.push(error);
                                this.check_result(resolve);
                            });
                    }
                }
            }
        );
    }
}
