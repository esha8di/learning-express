import express, { text, type Application, type Request, type Response } from "express"
const app : Application = express()
const port = 3000

import {Pool} from "pg"
app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({extended: true})) // will accept nested data

const pool= new Pool({
  connectionString:"postgresql://neondb_owner:npg_dUWIvE51OSmq@ep-misty-leaf-aqbki0w4.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require"
})
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
