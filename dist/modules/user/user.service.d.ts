import type { IUser } from "./user.interface";
export declare const userService: {
    createUserInDB: (payload: IUser) => Promise<import("pg").QueryResult<any>>;
    getUserFromDB: () => Promise<import("pg").QueryResult<any>>;
};
//# sourceMappingURL=user.service.d.ts.map