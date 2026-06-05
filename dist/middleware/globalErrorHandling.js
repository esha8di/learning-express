import express, {} from "express";
export const globalErrorHandling = (err, req, res, next) => {
    console.error(err.stack); // Log the error
    res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};
//# sourceMappingURL=globalErrorHandling.js.map