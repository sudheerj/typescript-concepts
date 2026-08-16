type MyPick<T, K extends keyof T> = {
    [P in K]: T[P]
}

interface User {
    name: string,
    age: number,
    email: string
}

type UserInfo = MyPick<User, "name" | "email">;