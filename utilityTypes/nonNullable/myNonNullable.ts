//Remove null and undefined
type MyNonNullable<T> = T extends null | undefined ? never : T;

type Value = string | null | undefined;

type Result = MyNonNullable<Value>; // string