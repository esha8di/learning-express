import express, {
  text,
  type Application,
  type Request,
  type Response,
} from "express";

import userRouter from "./modules/user/user.route";
import { profileRoute } from "./modules/profiles/profile.route";

const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true })); // will accept nested data

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "this is root",
    author: "esha",
  });
});

app.use("/api/user",userRouter);
app.use("/api/profile",profileRoute);


export default app;
