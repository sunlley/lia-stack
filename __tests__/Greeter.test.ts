import Stack from "../src";

describe('Test Stack', () => {
    let items: any;
    beforeEach(() => {
        // items = [{name: 'a'}, {name: 'b'}];
        items = [{name: 'b'}];
    })
    test('Test Tasks', async () => {
        const result = await new Stack<{ name: string }>(
            (item, _index: number, resolve, reject) => {
                console.log('index', _index)
                if (item.name === 'b') {
                    setTimeout(() => {
                        reject(item)
                    }, 1000)
                } else {
                    resolve(item)
                }

            },
            {
                items,
                timeouts: [500]
            }
        ).exec();
        console.log('result', result)
        expect('Hello Carl').toBe('Hello Carl');
    }, 5000);
});
