# Top 30 Advanced TypeScript Interview Topics

This repository follows the same style as the JavaScript interview question collection: it begins with an outline and then covers each topic with deeper explanations and practical examples. The focus here is on real-world TypeScript concepts that interviews often test and that developers use in production systems.

## Outline

1. Type system fundamentals
2. Type inference and narrowing
3. Functions, objects, and API contracts
4. Generics and reusable abstractions
5. Utility types and type transformations
6. Advanced type patterns
7. Strictness, safety, and async behavior
8. Real-world TypeScript design mindset

---

## 1. Type System Fundamentals

### 1. Structural typing
TypeScript uses structural typing, meaning that compatibility is based on shape rather than class name. This is especially important in JavaScript-based systems, where different objects can naturally satisfy the same interface.

```ts
type User = {
  id: number;
  name: string;
};

const person = { id: 1, name: 'John', age: 30 };

function printUser(user: User) {
  console.log(user.name);
}

printUser(person); // OK because person has all required fields
```

Why this matters: a plain JavaScript object can be passed as long as it has the required properties. This makes TypeScript feel natural in dynamic environments while still providing safety.

### 2. Type vs interface
`type` is more flexible for unions, intersections, and utility transformations, while `interface` is ideal for object contracts and declaration merging.

```ts
interface Product {
  id: number;
  name: string;
}

type ProductPayload = Product & {
  price: number;
};

const item: ProductPayload = {
  id: 1,
  name: 'Laptop',
  price: 999,
};
```

When to use which:
- use `interface` for public object contracts
- use `type` for more advanced type composition

### 3. Primitive, literal, and enum types
Primitive types are general categories like `string` and `number`, but literal types are exact values like `'admin'` or `42`.

```ts
let role: 'admin' | 'user' = 'admin';
// role = 'guest'; // error

enum Status {
  Active = 'active',
  Inactive = 'inactive',
}

const current: Status = Status.Active;
```

Literal types are very useful in APIs because they prevent invalid values early.

### 4. Union and intersection types
A union means a variable can be one of multiple types. An intersection combines multiple types into one.

```ts
type StringOrNumber = string | number;

type Person = {
  name: string;
};

type Employee = Person & {
  employeeId: number;
};

const value: StringOrNumber = 'hello';
const employee: Employee = { name: 'Sam', employeeId: 101 };
```

These are heavily used in API modeling, event systems, and configuration objects.

### 5. Optional and nullable values
Optional and nullable are not the same.

```ts
type User = {
  name: string;
  email?: string; // optional
  age: number | null; // can be null
};

const user: User = {
  name: 'Alice',
  age: null,
};
```

If `email` is missing, TypeScript allows it. If `age` is `null`, that is explicit and must be handled safely.

---

## 2. Type Inference and Narrowing

### 6. Type inference
TypeScript automatically infers types from assignments and usage, reducing the need for explicit annotations.

```ts
const numbers = [1, 2, 3];
// inferred as number[]

const greeting = 'hello';
// inferred as string

const fn = (x: number) => x * 2;
```

TypeScript is smart enough to infer a lot, but explicit types are still important in public APIs and complex logic.

`typeof` means different things in JavaScript and TypeScript:

- In JavaScript, `typeof value` is a runtime check that returns values like `'string'`, `'number'`, and `'object'`.
- In TypeScript, `typeof` is also used in type positions to refer to the type of an existing value.

```ts
const status = 'active';

const anotherStatus: typeof status = 'inactive';
// same as: 'active' | 'inactive' if widened by union context
```

This helps when you want to reuse the exact type of a variable without repeating it manually.

### 7. Control-flow narrowing
TypeScript narrows the type inside conditions based on runtime checks.

```ts
function format(value: string | number) {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }

  return value.toFixed(2);
}

console.log(format('hello')); // HELLO
console.log(format(12.34)); // 12.34
```

This is one of the most useful patterns in TypeScript because it keeps the code safe without repeated casts.

`instanceof` is a runtime JavaScript operator, so it only works with values that are actual runtime objects created by a constructor or class. An `interface` does not exist at runtime, because TypeScript removes it during compilation.

```ts
interface Animal {
  name: string;
}

class Dog {
  constructor(public name: string) {}
}

const pet: Animal = new Dog('Max');

// console.log(pet instanceof Animal); // error
// Animal is not a value, so JavaScript cannot check it at runtime
console.log(pet instanceof Dog); // true
```

This is why you use a type guard or a class check instead of `instanceof` with an interface.

### 8. User-defined type guards
When data comes from outside the app, TypeScript sometimes needs help narrowing it.

```ts
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

const data: unknown = 'hello';

if (isString(data)) {
  console.log(data.toUpperCase());
}
```

This is common when parsing JSON, reading environment variables, or validating third-party inputs.

### 9. Discriminated unions
A discriminated union is a union of object types with a common literal property.

```ts
type PaymentResult =
  | { status: 'success'; amount: number }
  | { status: 'failed'; error: string };

function handlePayment(result: PaymentResult) {
  if (result.status === 'success') {
    console.log('Paid:', result.amount);
  } else {
    console.log('Error:', result.error);
  }
}
```

This pattern is widely used for APIs, forms, and state handling because it gives compile-time safety and easy runtime branching.

### 10. `any`, `unknown`, `never`, and `void`
These are core concepts that interviews often test.

```ts
let a: any = 123;
a = 'hello';
a.toUpperCase(); // no error

let b: unknown = 123;
// b.toUpperCase(); // error
if (typeof b === 'string') {
  console.log(b.toUpperCase());
}

function fail(): never {
  throw new Error('Something broke');
}

function log(): void {
  console.log('done');
}
```

Interpretation:
- `any` = unsafe and permissive
- `unknown` = safe but needs narrowing
- `never` = impossible scenario
- `void` = function returns nothing useful

---

## 3. Functions, Objects, and API Contracts

### 11. Function overloads
Overloads let a function accept multiple parameter shapes while following a single implementation.

```ts
function parse(input: string): string[];
function parse(input: number): number[];
function parse(input: string | number): string[] | number[] {
  if (typeof input === 'string') {
    return input.split('');
  }

  return Array.from({ length: input }, (_, i) => i);
}

console.log(parse('abc')); // ['a','b','c']
console.log(parse(3)); // [0,1,2]
```

This pattern is especially useful for library APIs and utility functions that need to behave differently based on input type.

### 12. Parameter and return typing
TypeScript lets you describe function inputs and outputs explicitly.

```ts
function createUser(name: string, age: number): { id: number; name: string; age: number } {
  return { id: 1, name, age };
}

const user = createUser('Sam', 28);
console.log(user.name);
```

This improves readability and makes external APIs predictable.

### 13. Higher-order functions
A function that accepts or returns another function is called a higher-order function.

```ts
const withLogging = <T>(fn: (value: T) => T) => {
  return (value: T) => {
    console.log('Before call');
    const result = fn(value);
    console.log('After call');
    return result;
  };
};

const double = (n: number) => n * 2;
const loggedDouble = withLogging(double);
console.log(loggedDouble(5)); // 10
```

This pattern is common in middleware, event handling, and functional utilities.

### 14. Rest parameters and tuples
Rest parameters can collect multiple arguments, and tuple types keep their order precise.

```ts
function printCoords(...coords: [number, number, number]) {
  console.log(coords[0], coords[1], coords[2]);
}

printCoords(10, 20, 30);
```

Tuples are useful for coordinates, RGB values, and fixed-length arguments.

### 15. `this` typing
When a method is used as a callback, `this` can become confusing. TypeScript can help model it.

```ts
const user = {
  name: 'Ava',
  greet(this: { name: string }) {
    return `Hello ${this.name}`;
  },
};

console.log(user.greet());
```

This avoids accidental misuse when methods are detached from their objects.

---

## 4. Generics and Reusable Abstractions

### 16. Generic functions
Generics allow code to work across many types while keeping type safety.

```ts
function identity<T>(value: T): T {
  return value;
}

const num = identity(10); // number
const text = identity('hello'); // string
const obj = identity({ id: 1 }); // { id: number }
```

This is one of the most important TypeScript features because it helps build reusable logic without `any`.

### 17. Generic constraints
Constraints limit the types allowed in a generic.

```ts
function getLength<T extends { length: number }>(value: T): number {
  return value.length;
}

console.log(getLength('hello')); // 5
console.log(getLength([1, 2, 3])); // 3
```

Without the constraint, TypeScript could not guarantee the property `length` exists.

### 18. `keyof` and indexed access
`keyof` gets all keys from a type, while indexed access gives the type of a known property.

```ts
type User = {
  id: number;
  name: string;
  email: string;
};

type UserKey = keyof User; // 'id' | 'name' | 'email'
type UserName = User['name']; // string
```

This is commonly used for dynamic property access and typed utility functions.

### 19. Default generic parameters
Defaults reduce boilerplate when a caller does not specify a type.

```ts
interface Box<T = string> {
  value: T;
}

const first: Box = { value: 'hello' };
const second: Box<number> = { value: 42 };
```

This pattern makes generic APIs easier to consume.

### 20. Variance and assignability
Variance explains how function and generic types relate to each other during assignment checks.

```ts
class Animal {}
class Dog extends Animal {}

let animalFn: (arg: Animal) => void;
let dogFn: (arg: Dog) => void;

animalFn = (pet: Animal) => console.log(pet);
dogFn = (pet: Dog) => console.log(pet);

// strict function types can make this relationship more constrained
```

This is a deeper topic, but it explains why some generic assignments are allowed and others are not.

---

## 5. Utility Types and Type Transformations

### 21. Built-in utility types
TypeScript includes helper types that simplify common transformations.

```ts
type User = {
  id: number;
  name: string;
  email: string;
};

type PartialUser = Partial<User>;
type ReadonlyUser = Readonly<User>;
type UserPreview = Pick<User, 'id' | 'name'>;
type UserWithoutEmail = Omit<User, 'email'>;
```

These are used heavily in APIs, state management, and validation logic.

### 22. `Exclude`, `Extract`, and `NonNullable`
These are useful when handling unions and filtering types.

```ts
type Value = string | number | null | undefined;

type NumberOnly = Extract<Value, number>; // number

type StringOrNumber = Exclude<Value, null | undefined>; // string | number

type DefinedValue = NonNullable<Value>; // string | number
```

These utilities are common in generic helper functions and validation layers.

### 23. Mapped types
Mapped types create new object types from existing ones.

```ts
type ReadonlyFields<T> = {
  readonly [K in keyof T]: T[K];
};

type User = {
  id: number;
  name: string;
};

const user: ReadonlyFields<User> = { id: 1, name: 'Sam' };
// user.id = 2; // error
```

This is the foundation for many built-in utility types.

### 24. Conditional types
Conditional types let type definitions depend on test conditions.

```ts
type IsString<T> = T extends string ? 'yes' : 'no';

type A = IsString<string>; // 'yes'
type B = IsString<number>; // 'no'
```

These are used extensively in advanced library design and generic helper patterns.

### 25. `infer` in conditional types
`infer` lets you capture a type inside a conditional type.

```ts
type ReturnTypeOf<T> = T extends (...args: any[]) => infer R ? R : never;

type Result = ReturnTypeOf<() => number>; // number
```

This is a classic interview topic and a very powerful TypeScript pattern for library authors.

---

## 6. Advanced Type Patterns

### 26. Template literal types
Template literal types build string literal unions from patterns.

```ts
type EventName = 'click' | 'hover';
type HandlerName = `on${Capitalize<EventName>}`;
// 'onClick' | 'onHover'
```

This is often used for typed DOM events, route definitions, and naming conventions.

### 27. `as const` and `satisfies`
These are modern TypeScript features that preserve precision.

```ts
const palette = ['red', 'green', 'blue'] as const;

const config = {
  port: 3000,
  mode: 'production',
} satisfies {
  port: number;
  mode: 'development' | 'production';
};

// config.port is still 3000, not number
// config.mode is still 'production', not string

const routes = {
  home: '/home',
  dashboard: '/dashboard',
} satisfies Record<string, string>;
```

`as const` keeps values literal; `satisfies` validates compatibility without widening the type. It is especially useful when you want a value to match a specific shape while still preserving its exact literal values for autocomplete and inference.

Example: without `satisfies`, TypeScript might widen `mode` from `'production'` to `string`. With `satisfies`, the object is checked against a target type, but its inferred type remains precise.

### 28. Exhaustive checks with `never`
This is commonly used to ensure all variants of a union are handled.

```ts
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; side: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'square':
      return shape.side ** 2;
    default:
      const _exhaustive: never = shape;
      return _exhaustive;
  }
}
```

If a new shape type is added and not handled, TypeScript will flag it.

### 29. Declaration merging
Interfaces can be merged together.

```ts
interface User {
  name: string;
}

interface User {
  age: number;
}

const user: User = {
  name: 'Lucy',
  age: 32,
};
```

This is useful in libraries and frameworks that extend existing types without rewriting them.

### 30. Module augmentation and ambient declarations
This allows you to extend global or third-party types.

```ts
declare global {
  interface Window {
    __APP_VERSION__: string;
  }
}

window.__APP_VERSION__ = '1.0.0';
```

It is particularly useful when integrating custom APIs or browser-specific globals.

---

## 7. Strictness, Safety, and Async Behavior

### 31. Strict mode and compiler safety
TypeScript strict mode catches common mistakes early.

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

If `strict` is enabled, code is much harder to break with unexpected `undefined`, wrong types, or implicit `any` values.

### 32. Readonly arrays and tuples
`readonly` prevents mutation and is excellent for safety.

```ts
const point: readonly [number, number] = [10, 20];
// point[0] = 25; // error

const nums: readonly number[] = [1, 2, 3];
```

These are useful for immutable state, safe configuration, and internal API contracts.

### 33. Async function typing
Async functions always return `Promise<T>`.

```ts
async function fetchUser(): Promise<{ id: number; name: string }> {
  return { id: 1, name: 'Nina' };
}

fetchUser().then((user) => {
  console.log(user.name);
});
```

This keeps async flows strongly typed and easier to reason about.

### 34. `Awaited` and nested async types
`Awaited<T>` unwraps nested async values.

```ts
type Result = Awaited<Promise<Promise<string>>>; // string
```

This is useful in generic utilities and APIs that wrap asynchronous work in multiple layers.

### 35. Typed success/error flows
Modeling results explicitly makes async code easier to handle.

```ts
type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

async function loadUser(): Promise<ApiResult<{ id: number }>> {
  try {
    return { ok: true, data: { id: 42 } };
  } catch (error) {
    return { ok: false, error: 'Request failed' };
  }
}
```

This pattern is much safer than returning `any` or silently swallowing errors.

---

## 8. Real-World TypeScript Design Mindset

### 36. Designing robust APIs
A strong API should be explicit and easy to consume.

```ts
interface CreateUserRequest {
  name: string;
  email: string;
  age?: number;
}

function createUser(request: CreateUserRequest): { id: number } {
  return { id: 1 };
}
```

This avoids unclear runtime behavior and makes the contract obvious to teammates.

### 37. Balancing safety and readability
The most effective TypeScript code uses type annotations where they help, but avoids unnecessary complexity.

```ts
const users = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];
const ids = users.map((user) => user.id); // inferred as number[]
```

The compiler does a lot automatically; you do not need to annotate every line.

### 38. Choosing the right abstraction
Advanced TypeScript is not about using trickery for its own sake. It is about selecting the simplest pattern that models the business logic correctly.

```ts
type Status = 'pending' | 'success' | 'failed';

const status: Status = 'success';
```

This is often better than a generic string because it prevents invalid values at compile time.

---

## Key Takeaways

- TypeScript improves JavaScript by making code more predictable and maintainable.
- Structural typing, narrowing, and unions are core to the language.
- Generics and utility types help build flexible and reusable abstractions.
- Strict mode and readonly patterns reduce runtime bugs.
- The strongest TypeScript knowledge comes from understanding real-world trade-offs, not just syntax.

## Recommended Study Path

1. Start with structural typing and inference
2. Practice unions, literal types, and type guards
3. Learn generics, constraints, and utility types
4. Study conditional types and `infer`
5. Emphasize strict mode and async safety
6. Model real API flows with discriminated unions and typed results

This order moves from basic TypeScript understanding to advanced interview-level mastery with practical, production-ready examples.
