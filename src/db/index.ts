import { Pool } from "pg";
import config from "../config";

export const pool = new Pool({
  connectionString:
    config.connectionString 
});

export const initDB = async () => {
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