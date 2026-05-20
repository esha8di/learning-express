import { pool } from "../../db";
import { type Request, type Response } from "express";

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, age } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO users(name,email,password,age) VALUES($1,$2,$3,$4) RETURNING *`,
      [name, email, password, age],
    );
    res.status(200).json({ message: "user created successfully", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "error creating user", error: err });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users`);
    res.status(200).json({ message: "user data retrieved successfully", data: result.rows });
  } catch (err) {
    res.status(500).json({ message: "error fetching users", error: err });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json({ status: true, message: "user retrieved successfully", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "error fetching user", error: err });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, password, age } = req.body;
  try {
    const result = await pool.query(
      `UPDATE users SET name=COALESCE($1,name), email=COALESCE($2,email), password=COALESCE($3,password), age=COALESCE($4,age) WHERE id=$5 RETURNING *`,
      [name, email, password, age, id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json({ status: true, message: "user updated successfully", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "error updating user", error: err });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`DELETE FROM users WHERE id=$1 RETURNING *`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json({ status: true, message: "user deleted successfully", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "error deleting user", error: err });
  }
};
