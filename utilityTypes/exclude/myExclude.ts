//Remove types from union type
type MyExclude<T,U> = T extends U ? never: T;

type Color = "red" | "green" | "blue";
type Result = MyExclude<Color, "green">; // "red" | "blue"