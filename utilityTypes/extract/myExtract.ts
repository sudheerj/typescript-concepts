//Opposite to exclude
type MyExtract<T, U> = T extends U ? T : never;

type Color1 = "red" | "green" | "blue";
type Result1 = MyExtract<Color1, "red" | "yellow"> //"red"