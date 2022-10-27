const request = require("request")

describe("getMessages", () => {
    it("should send 200 ok", (done) => {
        request("http://localhost:3000/messages", (err, res) => {
        expect(JSON.parse(res.body).length).toBeGreaterThan(0)
        expect(res.statusCode).toEqual(200)    
        done()
        })
    })
})

describe("getMessages from specific user", () => {
    it("should send 200 ok", (done) => {
        request("http://localhost:3000/messages/alex", (err, res) => {
        expect(res.statusCode).toEqual(200)
        expect(JSON.parse(res.body).length).toBeGreaterThan(0)
        expect(JSON.parse(res.body)[0].name).toEqual("alex")  
        done()
        })
    })
})