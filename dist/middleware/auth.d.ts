import type { NextFunction, Request, Response } from "express";
type USER_ROLES = "admin" | "agent" | "user";
declare const auth: (...roles: USER_ROLES[]) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default auth;
//# sourceMappingURL=auth.d.ts.map