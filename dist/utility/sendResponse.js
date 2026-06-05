const sendResponse = (res, data) => {
    res
        .status(data.statusCode)
        .json({
        message: data.message,
        data: data.data
    });
};
export default sendResponse;
//# sourceMappingURL=sendResponse.js.map