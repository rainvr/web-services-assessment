import express from "express"

const app = express()
const port = 8080

app.use("/",(req,res)=>{
    res.send("hello world")
})
app.listen(port, ()=>{
    console.log("server is listening on port http://localhost:"+ port)
})