import express, {
  text,
  type Application,
  type Request,
  type Response,
} from "express";
import { Pool } from "pg";
const app: Application = express();
const port = 3000;

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true })); // will accept nested data

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_dUWIvE51OSmq@ep-misty-leaf-aqbki0w4-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

const initDB = async () => {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(20),
  email VARCHAR(20) UNIQUE not null,
  password VARCHAR(20) not null,
  is_active BOOLEAN default true,
  age INT,
  created_at TIMESTAMPTZ default now(),
  updated_at TIMESTAMPTZ default now()

)`);
    console.log("Table created successfully ");
  } catch (err) {
    console.log(err);
  }
};

initDB();
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "this is root",
    author: "esha",
  });
});

app.post("/user", async (req: Request, res: Response) => {
  const { name, email, password, age } = req.body;
  const result = await pool.query(
    `INSERT INTO users(name,email,password,age) VALUES($1,$2,$3,$4) RETURNING *`,
    [name, email, password, age],
  );
  
  res
    .status(200)
    .json({ message: "user created successfully", data: result.rows[0] });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
