type MyConstructorParameters<T> = T extends abstract new (...args: infer P) => any ? P : never;

class Person {
    constructor(
        public name: string,
        public age: number
    ) {

    }
}

type Parameters2 = MyConstructorParameters<typeof Person>; //[string, number]