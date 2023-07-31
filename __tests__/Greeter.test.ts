import Stack from "../src";

describe('Test Tasks', () => {
    let items:any;
    beforeEach(() => {
        console.log('Test')
        items = [{name: 'a'}, {name: 'b'}];
    })
    test('Test Tasks',async ()=>{
            const result = await new Stack<{ name: string }>(
                (item,index, resolve, reject) => {
                    // resolve(`${item}_123`)
                    if (item.name==='b'){
                        reject(item)
                    }else{
                        resolve(item)
                    }

                }
            ).tasks(items).exec();
            console.log('result',result)
        expect('Hello Carl').toBe('Hello Carl');
    },5000);
});