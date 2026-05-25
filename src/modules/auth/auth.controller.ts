import type { Request, Response } from "express";
import { authService } from "./auth.service";

const getUser = async(req:Request, res:Response)=>{
   
   try{
    const result = await authService.userFromDB(req.body);
    res.status(200).json({
        message:"login successful",
        data :result
    })

   }
   catch(error){
    const err = error as Error
    res.status(400).json({
        message:err.message,
        error:error
    })
   }


}

export const authController = {
    getUser
}