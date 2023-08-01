import {Task} from "./task";
import {StackError} from "./error";

export class Pool{
     #tasks: Task[];
     #results: any[];
     #errors: any[];
     #resultsTemp: any[];
     #errorsTemp: any[];
     #timeout?: number;

    constructor(tasks: Task[]) {
        this.#tasks = tasks;
        this.#results = []
        this.#errors = [];
        this.#resultsTemp = []
        this.#errorsTemp = [];
    }

    check_result(resolve: (payload:any)=>void) {
        const length = this.#tasks.length;
        if (length === this.#resultsTemp.length + this.#errorsTemp.length) {
            resolve({results: this.#results, errors: this.#errors})
        }
    }

    async exec(timeout?:number): Promise<{ results: any[], errors: any[] }> {
        this.#timeout = timeout;
        this.#resultsTemp = []
        this.#errorsTemp = [];
        return new Promise(
            (resolve,reject) => {
                if (this.#tasks != null && this.#tasks.length > 0) {
                    for (const task of this.#tasks) {
                        this.#results.push(null);
                        this.#errors.push(null);
                    }
                    for (let i = 0; i < this.#tasks.length; i++) {
                        const task = this.#tasks[i];
                        if (!task){continue;}
                        task.index=i;
                        let timer:any;
                        if (this.#timeout && this.#timeout>0){
                            timer = setTimeout(()=>{
                                const error = new StackError(`Time out ${this.#timeout}`);
                                if (task.reject){
                                    task.reject(error);
                                }
                                if (timer){
                                    clearTimeout(timer);
                                    timer=null;
                                }
                            },this.#timeout);
                        }
                        task.promise
                            .then((result) => {
                                this.#results[i] = result;
                                this.#resultsTemp.push(result);
                                if (timer){
                                    clearTimeout(timer);
                                    timer=null;
                                }
                                this.check_result(resolve);
                            })
                            .catch((error: any) => {
                                this.#errors[i] = error;
                                this.#errorsTemp.push(error);
                                if (timer){
                                    clearTimeout(timer);
                                    timer=null;
                                }
                                this.check_result(resolve);
                            });

                    }
                }else{
                    reject(new StackError('No tasks to schedule'))
                }
            }
        );
    }
}
