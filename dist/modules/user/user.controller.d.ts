import { type Request, type Response } from "express";
export declare const userController: {
    createUser: (req: Request, res: Response) => Promise<void>;
    getUser: (req: Request, res: Response) => Promise<void>;
    getUserById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
};
//# sourceMappingURL=user.controller.d.ts.map