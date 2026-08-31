type MyThisParameterType<T> = T extends (this: infer U, ...args: any[]) => any ? U : unknown;

function foo(this: {name: string}, age: number) {

}

type This = MyThisParameterType<typeof foo>;