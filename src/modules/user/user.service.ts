import { pool } from "../../db";
import * as bcrypt from "bcrypt";
import type { IUser } from "./user.interface";

const createUserInDB = async (payload: IUser) => {
    const { name, email, password, age, role} = payload;
    const hashPassword = await bcrypt.hash(password, 12);
    const result = await pool.query(
        `INSERT INTO users(name,email,password,age,role) VALUES($1,$2,$3,$4,COALESCE($5,'user')) RETURNING *`,
        [name, email, hashPassword, age, role],
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