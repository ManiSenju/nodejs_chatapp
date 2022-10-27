const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

const port = process.env.PORT || 3000
const dbUrl = "mongodb+srv://manisenju:manisenju@cluster0.ba6qrzf.mongodb.net/?retryWrites=true&w=majority"
const app = express()
const http = require("http").Server(app)
const io = require ("socket.io")(http)

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

const Message = mongoose.model('message', {
    name: String,
    message: String
})
app.get("/messages", (req, res) => {
    const messages = Message.find({}, (err, msg) => {
        res.send(msg)
    })
})

app.get("/messages/:user", (req, res) => {
    const messages = Message.find({name:req.params.user}, (err, msg) => {
        res.send(msg)
    })
})

app.post("/messages", async (req, res) => {
    try {
        const msg = new Message(req.body)
        const savedMsg = await msg.save()
        const censored = await msg.findOne({message: "badword"})
        if(censored) {
            await msg.remove({
                _id: censored.id
            })
        } else {
            io.emit("message", req.body)
        }
        res.sendStatus(200)
    } catch(e){
        res.sendStatus(500)
    } finally {
        //logger.log("post call happened")
    }
})

io.on("connection", (socket) => {
    console.log("a user connected")
})

mongoose.connect(dbUrl,(err) => {
    console.log("mongodb connected ",err)
})

http.listen(port,() => {
    console.log(`Server is up and running on port: ${port}`)
})
