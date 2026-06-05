// src/app.ts
import express2 from "express";

// src/modules/user/user.route.ts
import { Router } from "express";
import "express";

// src/db/index.ts
import { Pool } from "pg";

// src/config/index.ts
import dotenv from "dotenv";
import path from "path";
dotenv.config(
  {
    path: path.resolve(process.cwd(), ".env")
  }
);
var config = {
  port: process.env.PORT,
  connectionString: process.env.CONNECTION_STRING,
  secret: process.env.SECRET_KEY,
  refresh_secret: process.env.REFRESH_SECRET
};
var config_default = config;

// src/db/index.ts
var pool = new Pool({
  connectionString: config_default.connectionString
});
var initDB = async () => {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(20),
  email VARCHAR(20) UNIQUE not null,
  password TEXT not null,
  is_active BOOLEAN default true,
  age INT,
  role VARCHAR(20) default 'user',
  created_at TIMESTAMPTZ default now(),
  updated_at TIMESTAMPTZ default now()

)`);
    await pool.query(`CREATE TABLE IF NOT EXISTS profiles (
  id Serial PRIMARY KEY,
  user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  bio VARCHAR(255),
  phone VARCHAR(15),
  gender VARCHAR(10),
  created_at TIMESTAMPTZ default now(),
  updated_at TIMESTAMPTZ default now()
)`);
    console.log("Table created successfully ");
  } catch (err) {
    console.log(err);
  }
};

// src/modules/user/user.controller.ts
import "express";

// src/modules/user/user.service.ts
import * as bcrypt from "bcrypt";
var createUserInDB = async (payload) => {
  const { name, email, password, age, role } = payload;
  const hashPassword = await bcrypt.hash(password, 12);
  const result = await pool.query(
    `INSERT INTO users(name,email,password,age,role) VALUES($1,$2,$3,$4,COALESCE($5,'user')) RETURNING *`,
    [name, email, hashPassword, age, role]
  );
  return result;
};
var getUserFromDB = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  delete result.rows[0].password;
  return result;
};
var userService = {
  createUserInDB,
  getUserFromDB
};

// src/utility/sendResponse.ts
var sendResponse = (res, data) => {
  res.status(data.statusCode).json({
    message: data.message,
    data: data.data
  });
};
var sendResponse_default = sendResponse;

// src/modules/user/user.controller.ts
var createUser = async (req, res) => {
  try {
    const result = await userService.createUserInDB(req.body);
    console.log("user", result);
    sendResponse_default(res, {
      statusCode: 200,
      message: "user created succcessfully",
      data: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ message: "error creating user", error: err });
  }
};
var getUser = async (req, res) => {
  const result = await userService.getUserFromDB();
  res.status(200).json({ message: "user data retieve successfully", data: result.rows });
};
var getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json({
      status: true,
      message: "user retrieved successfully",
      data: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ message: "error fetching user", error: err });
  }
};
var userController = {
  createUser,
  getUser,
  getUserById
};

// src/middleware/auth.ts
import jwt from "jsonwebtoken";
var auth = (...roles) => {
  return async (req, res, next) => {
    console.log(roles);
    const token = req.headers.authorization;
    if (!token) {
      res.status(401).json({
        message: "unauthorized access !!"
      });
    }
    const decodedToken = jwt.verify(token, config_default.secret);
    const user = await pool.query(
      `SELECT * FROM users where email=$1`,
      [decodedToken.email]
    );
    if (user.rows.length === 0) {
      res.status(401).json({
        message: "user not found !!"
      });
    }
    if (user.rows.length && !roles.includes(user.rows[0].role)) {
      res.status(401).json({
        message: "this role does not exist!!"
      });
    }
    next();
  };
};
var auth_default = auth;

// src/types/index.ts
var ROLES = {
  admin: "admin",
  agent: "agent",
  user: "user"
};

// src/modules/user/user.route.ts
var router = Router();
router.post("/", userController.createUser);
router.get("/", auth_default(ROLES.admin, ROLES.agent, ROLES.user), userController.getUser);
router.get("/:id", userController.getUserById);
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, password, age } = req.body;
  try {
    const result = await pool.query(
      `UPDATE 
      users set 
      name =COALESCE($1, name), email = COALESCE($2, email), password = COALESCE($3, password), age = COALESCE($4, age) where id = $5 RETURNING *`,
      [name, email, password, age, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json({
      status: true,
      message: "user updated successfully",
      data: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ message: "error updating user", error: err });
  }
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM users WHERE id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json({
      status: true,
      message: "user deleted successfully",
      data: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ message: "error deleting user", error: err });
  }
});
var userRoute = router;
var user_route_default = userRoute;

// src/modules/profiles/profile.route.ts
import { Router as Router2 } from "express";

// src/modules/profiles/profile.service.ts
var createUserInDB2 = async (payload) => {
  const { user_id, bio, phone, gender } = payload;
  const user = await pool.query(
    `SELECT * FROM users where id=$1`,
    [user_id]
  );
  if (user.rows.length === 0) {
    throw new Error("User not exist!");
  }
  const result = await pool.query(
    `INSERT INTO profiles(user_id, bio, phone, gender) 
        VALUES($1,$2,$3,$4)  RETURNING * `,
    [user_id, bio, phone, gender]
  );
  return result;
};
var getProfileFromDB = async () => {
  const result = await pool.query(
    `SELECT * FROM profiles`
  );
  return result;
};
var profileService = {
  createUserInDB: createUserInDB2,
  getProfileFromDB
};

// src/modules/profiles/profile.controller.ts
var createProfie = async (req, res) => {
  try {
    const result = await profileService.createUserInDB(req.body);
    console.log(result);
    res.status(200).json({ message: "user created successfully", data: result.rows[0] });
  } catch (error) {
    const err = error;
    res.status(500).json({ message: "error creating user", error: err.message });
  }
};
var getProfile = async (req, res) => {
  try {
    const result = await profileService.getProfileFromDB();
    res.status(200).json({ messgae: "Data retirve successfully", data: result.rows });
  } catch (err) {
    res.status(500).json({ message: err.message, error: err });
  }
};
var profileController = {
  createProfie,
  getProfile
};

// src/modules/profiles/profile.route.ts
var router2 = Router2();
var profileRoute = router2;
router2.post("/", profileController.createProfie);
router2.get("/", profileController.getProfile);

// src/modules/auth/auth.route.ts
import { Router as Router3 } from "express";

// src/modules/auth/auth.service.ts
import * as bcrypt2 from "bcrypt";
import jwt2 from "jsonwebtoken";
var userFromDB = async (payload) => {
  const { email, password } = payload;
  const user = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
  if (user.rows.length === 0) {
    throw new Error("Invalid credential!");
  }
  const comparePassword = await bcrypt2.compare(password, user.rows[0].password);
  if (!comparePassword) {
    throw new Error("Invalid credential!");
  }
  const jsonPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role
  };
  const accessToken = jwt2.sign(jsonPayload, config_default.secret, { expiresIn: "1d" });
  const refreshToken2 = jwt2.sign(jsonPayload, config_default.refresh_secret, { expiresIn: "1d" });
  return { accessToken, refreshToken: refreshToken2 };
};
var generateRefreshtoken = async (token) => {
  console.log(token);
  if (!token) {
    throw new Error("unauthorized access1");
  }
  const decodedToken = jwt2.verify(token, config_default.refresh_secret);
  const user = await pool.query(
    `SELECT * FROM users where email=$1`,
    [decodedToken.email]
  );
  if (user.rows.length === 0) {
    throw new Error("unauthorized access2");
  }
  const jsonPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role
  };
  const accessToken = jwt2.sign(jsonPayload, config_default.secret, { expiresIn: "10d" });
  return { accessToken };
};
var authService = {
  userFromDB,
  generateRefreshtoken
};

// src/modules/auth/auth.controller.ts
var userLogin = async (req, res) => {
  try {
    const result = await authService.userFromDB(req.body);
    const { refreshToken: refreshToken2 } = result;
    res.cookie("refresh_token", refreshToken2, {
      secure: false,
      httpOnly: true,
      sameSite: "lax"
    });
    res.status(200).json({
      message: "login successful",
      data: result
    });
  } catch (error) {
    const err = error;
    res.status(400).json({
      message: err.message,
      error
    });
  }
};
var refreshToken = async (req, res) => {
  try {
    const result = await authService.generateRefreshtoken(req.cookies.refresh_token);
    console.log("TOKEN FROM COOKIE:", req.cookies.refresh_token);
    res.status(200).json({
      message: "token refreshed",
      data: result
    });
  } catch (error) {
    const err = error;
    res.status(400).json({
      message: err.message,
      error
    });
  }
};
var authController = {
  userLogin,
  refreshToken
};

// src/modules/auth/auth.route.ts
var router3 = Router3();
router3.post("/", authController.userLogin);
router3.post("/refresh_token", authController.refreshToken);
var authRoute = router3;

// src/app.ts
import cookieParser from "cookie-parser";
import cors from "cors";

// src/middleware/globalErrorHandling.ts
import "express";
var globalErrorHandling = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
};

// src/app.ts
var app = express2();
app.use(cors(
  {
    origin: "http://localhost"
  }
));
app.use(express2.json());
app.use(express2.text());
app.use(express2.urlencoded({ extended: true }));
app.use(cookieParser());
app.get("/", (req, res) => {
  res.status(200).json({
    message: "this is root",
    author: "esha"
  });
});
app.use("/api/user", user_route_default);
app.use("/api/profile", profileRoute);
app.use("/api/auth", authRoute);
app.use(globalErrorHandling);
var app_default = app;

// src/server.ts
var port = config_default.port;
var main = async () => {
  try {
    await initDB();
    app_default.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.log("Failed to connect database", error);
  }
};
main();
//# sourceMappingURL=server.js.map