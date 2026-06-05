import { profileService } from "./profile.service";
const createProfie = async (req, res) => {
    try {
        const result = await profileService.createUserInDB(req.body);
        console.log(result);
        res.status(200).json({ message: "user created successfully", data: result.rows[0] });
    }
    catch (error) {
        const err = error;
        res.status(500).json({ message: "error creating user", error: err.message });
    }
};
const getProfile = async (req, res) => {
    try {
        const result = await profileService.getProfileFromDB();
        res.status(200).json({ messgae: "Data retirve successfully", data: result.rows });
    }
    catch (err) {
        res.status(500).json({ message: err.message, error: err });
    }
};
export const profileController = {
    createProfie,
    getProfile
};
//# sourceMappingURL=profile.controller.js.map