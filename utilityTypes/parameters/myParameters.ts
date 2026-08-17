type MyParameters<T> = T extends (...args: infer P) => any ? P : never;

function add(a: number, b: string, c: boolean) {

}

type Parameters1 = MyParameters<typeof add>; //[number, string, boolean]