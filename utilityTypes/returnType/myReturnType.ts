type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getUser() {
    return {
        id: 1,
        name: 'Sudheer',
        age: 30
    }
}

type User = MyReturnType<typeof getUser>; 
//{
//    id: 1,
//    name: 'Sudheer',
//    age: 30
//}
