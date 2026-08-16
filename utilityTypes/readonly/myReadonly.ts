type MyReadonly<T> ={
    readonly [P in keyof T]: T[P]
}

interface User {
    name: string,
    age: number,
    email: string
}

type ReadOnlyUser = MyReadonly<User>

const readOnlyUser: ReadOnlyUser = {
    name: 'Sudheer',
    age: 30,
    email: 'jsudheer@gmail.com'
}

//readOnlyUser.name = 'John'; //Error