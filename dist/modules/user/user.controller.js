import {} from "express";
import { pool } from "../../db";
import { userService } from "./user.service";
import sendResponse from "../../utility/sendResponse";
const createUser = async (req, res) => {
    try {
        const result = await userService.createUserInDB(req.body);
        console.log("user", result);
        sendResponse(res, {
            statusCode: 200,
            message: "user created succcessfully",
            data: result.rows[0]
        });
    }
    catch (err) {
        res.status(500).json({ message: "error creating user", error: err });
    }
};
const getUser = async (req, res) => {
    const result = await userService.getUserFromDB();
    res
        .status(200)
        .json({ message: "user data retieve successfully", data: result.rows });
};
const getUserById = async (req, res) => {
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
    }
    catch (err) {
        res.status(500).json({ message: "error fetching user", error: err });
    }
};
export const userController = {
    createUser,
    getUser,
    getUserById,
};
//# sourceMappingURL=user.controller.js.map