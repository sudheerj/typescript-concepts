type MyPartial<T> = {
    [P in keyof T]?: T[P]
}

interface User {
    name: string,
    email: string,
    password: number
}

type OptionalUser = MyPartial<User>;

const publicUser: OptionalUser = {
    name: 'Sudheer',
    email: 'jsudheer50@gmail.com'
}

console.log(publicUser);