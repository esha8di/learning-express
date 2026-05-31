import type { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";

type USER_ROLES = "admin" | "agent" | "user";

const auth = (...roles: USER_ROLES[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        console.log(roles)
        const token = req.headers.authorization;

        if (!token) {
            res.status(401).json({
                message: "unauthorized access !!"

            })
        }

        const decodedToken: jsonPayload = jwt.verify(token as string, config.secret as string)


        const user = await pool.query(
            `SELECT * FROM users where email=$1`,
            [decodedToken.email]
        )

        if (user.rows.length === 0) {
            res.status(401).json({
                message: "user not found !!"

            })

        }
        if (user.rows.length && !roles.includes(user.rows[0].role)) {
            res.status(401).json({
                message: "this role does not exist!!"

            })

        }
        next()
    }
}

export default auth;