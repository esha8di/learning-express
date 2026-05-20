import express, {
  text,
  type Application,
  type Request,
  type Response,
} from "express";
import { pool } from "./db";

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
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "user not found" });
    }

    res
      .status(200)
      .json({
        status: true,
        message: "user retrieved successfully",
        data: result.rows[0],
      });
  } catch (err) {
    res.status(500).json({ message: "error fetching user", error: err });
  }
});

app.put("/api/user/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, password, age } = req.body;
  try {
    const result = await pool.query(
      `UPDATE 
      users set 
      name =COALESCE($1, name), email = COALESCE($2, email), password = COALESCE($3, password), age = COALESCE($4, age) where id = $5 RETURNING *`,
      [name, email, password, age, id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "user not found" });
    }
    res
      .status(200)
      .json({
        status: true,
        message: "user updated successfully",
        data: result.rows[0],
      });
  } catch (err) {
    res.status(500).json({ message: "error updating user", error: err });
  }
});

app.delete("/api/user/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM users WHERE id = $1 RETURNING *`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "user not found" });
    }

    res
      .status(200)
      .json({
        status: true,
        message: "user deleted successfully",
        data: result.rows[0],
      });
  } catch (err) {
    res.status(500).json({ message: "error deleting user", error: err });
  }
});

export default app;
