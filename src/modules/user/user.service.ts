import { pool } from "../../db";
import * as bcrypt from "bcrypt";

const createUserInDB = async (payload: any) => {
    const { name, email, password, age } = payload;
    const hashPassword = await bcrypt.hash(password, 12);
    const result = await pool.query(
        `INSERT INTO users(name,email,password,age) VALUES($1,$2,$3,$4) RETURNING *`,
        [name, email, hashPassword, age],
    );
    return result;
}
const getUserFromDB = async () => {
    const result = await pool.query(`SELECT * FROM users`);
    delete result.rows[0].password;
    return result;
}


export const userService = {
    createUserInDB,
    getUserFromDB
}