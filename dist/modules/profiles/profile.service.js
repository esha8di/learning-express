import { pool } from "../../db";
const createUserInDB = async (payload) => {
    const { user_id, bio, phone, gender } = payload;
    const user = await pool.query(`SELECT * FROM users where id=$1`, [user_id]);
    if (user.rows.length === 0) {
        throw new Error("User not exist!");
    }
    const result = await pool.query(`INSERT INTO profiles(user_id, bio, phone, gender) 
        VALUES($1,$2,$3,$4)  RETURNING * `, [user_id, bio, phone, gender]);
    return result;
};
const getProfileFromDB = async () => {
    const result = await pool.query(`SELECT * FROM profiles`);
    return result;
};
export const profileService = {
    createUserInDB,
    getProfileFromDB
};
//# sourceMappingURL=profile.service.js.map