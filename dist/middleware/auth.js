import jwt, {} from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
const auth = (...roles) => {
    return async (req, res, next) => {
        console.log(roles);
        const token = req.headers.authorization;
        if (!token) {
            res.status(401).json({
                message: "unauthorized access !!"
            });
        }
        const decodedToken = jwt.verify(token, config.secret);
        const user = await pool.query(`SELECT * FROM users where email=$1`, [decodedToken.email]);
        if (user.rows.length === 0) {
            res.status(401).json({
                message: "user not found !!"
            });
        }
        if (user.rows.length && !roles.includes(user.rows[0].role)) {
            res.status(401).json({
                message: "this role does not exist!!"
            });
        }
        next();
    };
};
export default auth;
//# sourceMappingURL=auth.js.map