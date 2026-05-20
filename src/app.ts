import express, {
  text,
  type Application,
  type Request,
  type Response,
} from "express";
import { pool } from "./db";
import userRoute from "./modules/user/user.route";

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

app.use("/api/user", userRoute);



export default app;
