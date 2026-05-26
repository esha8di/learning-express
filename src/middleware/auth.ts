import type { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";

const auth = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization;

        if (!token) {
            res.status(401).json({
                message: "unauthorized access !!"

            })
        }

        const decodedToken:jsonPayload = jwt.verify(token as string,config.secret as string)
           

        const user = await pool.query(
            `SELECT * FROM users where email=$1`,
            [decodedToken.email]
        )
        if(user.rows.length === 0){
             res.status(401).json({
                message: "user not found !!"

            })

        }
        next()
    }
}

export default auth;