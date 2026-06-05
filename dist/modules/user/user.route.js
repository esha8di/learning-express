import { Router } from "express";
const router = Router();
import {} from "express";
import { pool } from "../../db";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import { ROLES } from "../../types";
router.post("/", userController.createUser);
router.get("/", auth(ROLES.admin, ROLES.agent, ROLES.user), userController.getUser);
router.get("/:id", userController.getUserById);
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, email, password, age } = req.body;
    try {
        const result = await pool.query(`UPDATE 
      users set 
      name =COALESCE($1, name), email = COALESCE($2, email), password = COALESCE($3, password), age = COALESCE($4, age) where id = $5 RETURNING *`, [name, email, password, age, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "user not found" });
        }
        res
            .status(200)
            .json({
            status: true,
            message: "user updated successfully",
            data: result.rows[0],
        });
    }
    catch (err) {
        res.status(500).json({ message: "error updating user", error: err });
    }
});
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "user not found" });
        }
        res
            .status(200)
            .json({
            status: true,
            message: "user deleted successfully",
            data: result.rows[0],
        });
    }
    catch (err) {
        res.status(500).json({ message: "error deleting user", error: err });
    }
});
const userRoute = router;
export default userRoute;
//# sourceMappingURL=user.route.js.map