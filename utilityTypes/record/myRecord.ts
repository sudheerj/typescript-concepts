type MyRecord<K extends keyof any, T> = {
    [P in K]: T
}

type Scores = MyRecord<string, number>;

const scores: Scores = {
    Alice: 90,
    Bob: 80
}

type Status = "loading" | "success" | "error";
type StatusMessage = MyRecord<Status, string>;
