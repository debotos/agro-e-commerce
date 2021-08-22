import * as category from "./category"
// @ponicode
describe("category.default", () => {
    test("0", async () => {
        await category.default(["Corporate"], "Mustang")
    })

    test("1", async () => {
        await category.default(["District"], { Category: "The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design" })
    })

    test("2", async () => {
        await category.default(["Legacy"], false)
    })

    test("3", async () => {
        await category.default(["Future"], false)
    })

    test("4", async () => {
        await category.default(["Future"], "Mercielago")
    })

    test("5", async () => {
        await category.default([], true)
    })
})
