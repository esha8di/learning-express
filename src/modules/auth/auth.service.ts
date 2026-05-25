import { pool } from "../../db";
import * as bcrypt from "bcrypt"

import jwt from "jsonwebtoken"
import config from "../../config";
const userFromDB = async(payload:any)=>{
    const {email,password} = payload;

        const user = await pool.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        )
        if(user.rows.length === 0){
            throw new Error("Invalid credential!")
        }

        const comparePassword = await bcrypt.compare(password,user.rows[0].password)
        if(!comparePassword){
            throw new Error("Invalid credential!")
        }
        const jsonPayload:any={
            id:user.rows[0].id,
            name:user.rows[0].name,
            email:user.rows[0].email
        }

        const accessToken = jwt.sign(jsonPayload, config.secret as string  , {expiresIn:"1d"})

        return {accessToken}
   
}

export const authService = {
    userFromDB
}