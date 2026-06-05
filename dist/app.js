import express, { text, } from "express";
import fs from "fs";
import userRouter from "./modules/user/user.route";
import { profileRoute } from "./modules/profiles/profile.route";
import { authRoute } from "./modules/auth/auth.route";
import cookieParser from "cookie-parser";
import cors from "cors";
import { globalErrorHandling } from "./middleware/globalErrorHandling";
const app = express();
app.use(cors({
    origin: 'http://localhost',
}));
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true })); // will accept nested data
app.use(cookieParser());
// app.use((req,res,next)=>{
//   console.log("Method Url Time",Date.now().toLocaleString())
//   const log = `\n Methos -> ${req.method} - Url -> ${req.url} - Time -> ${Date.now()}\n`
//   fs.appendFile("text log",log,(err)=>{
//     console.log(err)
//   })
//   next();
// })
// app.use(auth)
app.get("/", (req, res) => {
    res.status(200).json({
        message: "this is root",
        author: "esha",
    });
});
app.use("/api/user", userRouter);
app.use("/api/profile", profileRoute);
app.use("/api/auth", authRoute);
app.use(globalErrorHandling);
export default app;
//# sourceMappingURL=app.js.map