import { createServer } from "http"
import express from "express"
import { Server as SocketServer } from "socket.io"
import * as path from "path"

const app = express();
const httpServer = createServer(app);
const io = new SocketServer(httpServer)


app.use(express.static(path.join(__dirname, "../public")))

app.get("/", async (req, res) => {
    return res.status(200).end(`<h1>Hello, WebRTC</h1>`)
})


let activeUserList: string[] = [];
io.on("connection", (socket) => {
    console.log("socket connected!")
    const existingSocket = activeUserList.indexOf(socket.id);
    if (existingSocket === -1) {
        activeUserList.push(socket.id)
    }
    io.emit("update-user", {
        activeUserList
    })

    socket.on("disconnect", () => {
        activeUserList = activeUserList.filter(id => id !== socket.id)
        io.emit("update-user", {
            activeUserList
        })
    })

    socket.on("call-user", (callInfo) => {
        socket.to(callInfo.to).emit("call-request", {
            offer: callInfo.offer,
            from: socket.id
        })
    })

    socket.on("call-accept", (callInfo) => {
        socket.to(callInfo.to).emit("call-confirm", {
            answer: callInfo.answer,
            from: socket.id
        })
    })
})



export default function listenServer() {
    const PORT = 5000;
    httpServer.listen(PORT, (...args) => {
        console.log(`Listening on PORT ${PORT}`)
    })
}