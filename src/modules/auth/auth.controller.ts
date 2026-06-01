import type { Request, Response } from "express";
import { authService } from "./auth.service";

const userLogin = async (req: Request, res: Response) => {

    try {
        const result = await authService.userFromDB(req.body);
        const { refreshToken } = result;
        res.cookie("refresh_token", refreshToken, {
            secure: false,
            httpOnly: true,
            sameSite: 'lax'
        })
        res.status(200).json({
            message: "login successful",
            data: result
        })

    }
    catch (error) {
        const err = error as Error
        res.status(400).json({
            message: err.message,
            error: error
        })
    }


}
const refreshToken = async (req: Request, res: Response) => {
    try {


        const result = await authService.generateRefreshtoken(req.cookies.refresh_token);
        console.log("TOKEN FROM COOKIE:", req.cookies.refresh_token);


        res.status(200).json({
            message: "token refreshed",
            data: result
        });

    } catch (error) {
        const err = error as Error;
        res.status(400).json({
            message: err.message,
            error: error
        });
    }
};

export const authController = {
    userLogin,
    refreshToken
}