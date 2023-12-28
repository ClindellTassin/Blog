import { Router } from "express";
import { sendEmail } from "../controllers/email.js";
import authMiddleware from "../middlewares/auth/auth.js";

const emailRoutes = Router();

emailRoutes.post('/', authMiddleware, sendEmail)

export default emailRoutes;