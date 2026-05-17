import express, { text, type Application, type Request, type Response } from "express"
const app : Application = express()
const port = 3000

app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({extended: true})) // will accept nested data


app.get('/', (req:Request, res:Response) => {
  res.status(200).json({
    message:"this is root",
    "author":"esha"
  })
})

app.post("/user", async(req:Request, res:Response)=>{
  console.log(req.body)

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
