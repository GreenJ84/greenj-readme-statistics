import { match } from "ts-pattern"

export const cardDirect = (type: string): Function => {
    const cardFunc: Function = match(type)
        .with ("insights", () => {
            return () =>{}
        })
        .with("languages", () => {
            return () =>{}
        })
        .with("stats", () => {
            return () =>{}
        })
        .run()

    return cardFunc;
}