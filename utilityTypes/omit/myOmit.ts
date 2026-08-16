type MyOmit<T, K extends keyof any> = {
    [P in keyof T as P extends K ? never : P]: T[P]
}

type MyOmit1<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

interface User {
    id: string,
    name: string,
    age: number
}

type UserWithoutId = MyOmit<User, 'id'>;
type UserWithoutId1 = MyOmit1<User, 'id'>;

const user: UserWithoutId ={
    name: 'Sudheer',
    age: 30
}

const user1: UserWithoutId1 ={
    name: 'Sudheer',
    age: 30
}