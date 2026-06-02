import { pool } from "../../db";
import * as bcrypt from "bcrypt"

import jwt, { type JwtPayload } from "jsonwebtoken"
import config from "../../config";
const userFromDB = async (payload: any) => {
    const { email, password } = payload;

    const user = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    )
    if (user.rows.length === 0) {
        throw new Error("Invalid credential!")
    }

    const comparePassword = await bcrypt.compare(password, user.rows[0].password)
    if (!comparePassword) {
        throw new Error("Invalid credential!")
    }
    const jsonPayload: any = {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        role: user.rows[0].role
    }

    const accessToken = jwt.sign(jsonPayload, config.secret as string, { expiresIn: "1d" })
    const refreshToken = jwt.sign(jsonPayload, config.refresh_secret as string, { expiresIn: "1d" })

    return { accessToken, refreshToken }

}

const generateRefreshtoken = async (token: string) => {

    console.log(token)
    if (!token) {
        throw new Error("unauthorized access1");
    }

    const decodedToken = jwt.verify(token as string, config.refresh_secret as string) as JwtPayload;


    const user = await pool.query(
        `SELECT * FROM users where email=$1`,
        [decodedToken.email]
    )

    if (user.rows.length === 0) {
        throw new Error("unauthorized access2");


    }
    const jsonPayload: any = {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        role: user.rows[0].role
    }

    const accessToken = jwt.sign(jsonPayload, config.secret as string, { expiresIn: "10d" })


    return { accessToken }

}

export const authService = {
    userFromDB,
    generateRefreshtoken
}