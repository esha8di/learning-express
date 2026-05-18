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

app.post("/api/user", async (req: Request, res: Response) => {
  const { name, email, password, age } = req.body;
  const result = await pool.query(
    `INSERT INTO users(name,email,password,age) VALUES($1,$2,$3,$4) RETURNING *`,
    [name, email, password, age],
  );
  try {
    res
      .status(200)
      .json({ message: "user created successfully", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "error creating user", error: err });
  }
});

app.get("/api/user", async (req: Request, res: Response) => {
  const result = await pool.query(`
    SELECT * FROM users`);
  res
    .status(200)
    .json({ message: "user data retieve successfully", data: result.rows });
});

app.get("/api/user/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "user not found" });
    }

    res.status(200).json({status:true, message: "user retrieved successfully", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "error fetching user", error: err });
  }
});

app.put("/api/user/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, password, age } = req.body;
  try{
    const result =await pool.query(
      `UPDATE 
      users set 
      name =COALESCE($1, name), email = COALESCE($2, email), password = COALESCE($3, password), age = COALESCE($4, age) where id = $5 RETURNING *`,
      [name, email, password, age, id]
    )
    if(result.rows.length===0){
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json({status:true, message: "user updated successfully", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "error updating user", error: err });
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


