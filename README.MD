# LIA STACK

JavaScript/TypeScript library of Execute multiple asynchronous tasks and return synchronous results

### install
```shell
npm install  lia-stack
```

### use
```typescript
import Stack from "lia-stack";
const start = async () => {
    let items = [{name: 'task1'},{name: 'task2'}];
    const result = await new Stack<{ name: string }>(
        (item, _index:number, resolve, reject) => {
            // do someting
            //resolve(result)
            //reject(error)
        }
    ).tasks(items).timeout(1000).exec();
}
start()

```
