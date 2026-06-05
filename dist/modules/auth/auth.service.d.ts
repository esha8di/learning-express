export declare const authService: {
    userFromDB: (payload: any) => Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    generateRefreshtoken: (token: string) => Promise<{
        accessToken: string;
    }>;
};
//# sourceMappingURL=auth.service.d.ts.map