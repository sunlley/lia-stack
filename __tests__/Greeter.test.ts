import Stack from "../src";

const random = (start: number, end: number) => {
    return Math.floor(Math.random() * (end - start)) + start;
}
const delay = (time:number) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    })
}
const randomDelay = () => {
    const time = random(1000, 5000);
    return delay(time);
}

describe('Test timeouts', () => {
    let items: any;
    let doList:any;
    beforeAll(async () => {
        items = [{name: 'a'}, {name: 'b'}];
        doList = await new Stack<{ name: string }>(
            async (item, _index: number, resolve) => {
                if (item.name === 'b') {
                    await delay(600);
                }
                resolve(item)
            },
            {
                items,
                timeouts: [100,500]
            }
        ).exec();
    })
    test('result length',  () => {
        const items = doList.results.filter((item:any)=>item!==null);
        expect(items.length).toBe(1);
    });
    test('errors length',  () => {
        const items = doList.errors.filter((item:any)=>item!==null);
        expect(items.length).toBe(1);
    });
});

describe('Test type single', () => {
    let items: any;
    let results: any;
    beforeAll(async () => {
        items = [
            {name: 'a'},
            {name: 'b'},
            {name: 'c'},
            {name: 'd'},
            {name: 'e'},
            {name: 'f'},
        ];
        const start = Date.now();
        const doList = await new Stack<{ name: string }, any>(
            async (item, _index: number, resolve, reject) => {
                await randomDelay();
                if (item.name === 'd') {
                    resolve(item)
                } else {
                    reject(null)
                }
            },
            {
                items,
                type: 'single'
            }
        ).exec();
        results = doList.results.filter((item: any) => item !== null);
        console.log('doList', 'time:', Date.now() - start)

    })
    test('result length', () => {
        expect(results.length).toEqual(1);
    });
    test('result name', () => {
        expect(results[0].name).toBe('d');
    });
});

