import express, {
  text,
  type Application,
  type Request,
  type Response,
} from "express";

import fs from "fs"
import userRouter from "./modules/user/user.route";
import { profileRoute } from "./modules/profiles/profile.route";
import { authRoute } from "./modules/auth/auth.route";


const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true })); // will accept nested data

// app.use((req,res,next)=>{
//   console.log("Method Url Time",Date.now().toLocaleString())
//   const log = `\n Methos -> ${req.method} - Url -> ${req.url} - Time -> ${Date.now()}\n`
//   fs.appendFile("text log",log,(err)=>{
//     console.log(err)
//   })
//   next();
// })

// app.use(auth)
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "this is root",
    author: "esha",
  });
});

app.use("/api/user", userRouter);
app.use("/api/profile", profileRoute);
app.use("/api/auth", authRoute)


export default app;
