type MyRequired<T> ={
    [P in keyof T]-?: T[P]
}

interface User {
    name?: string,
    email?: string,
    password?: number
}

type RequiredUser = MyRequired<User>;

const requiredUser: RequiredUser = {
    name: 'Sudheer',
    email: 'jsudheer50@gmail.com',
    password: 12345
}

console.log(requiredUser);