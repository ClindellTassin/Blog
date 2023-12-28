import { Router } from "express";
import authMiddleware from "../middlewares/auth/auth.js";
import { createCategory, deleteCategory, fetchCategories, fetchCategory, updateCategory } from "../controllers/category.js";

const categoryRoutes = Router();

categoryRoutes.post('/', authMiddleware, createCategory);
categoryRoutes.get('/', authMiddleware, fetchCategories);
categoryRoutes.get('/:id', authMiddleware, fetchCategory);
categoryRoutes.put('/:id', authMiddleware, updateCategory);
categoryRoutes.delete('/:id', authMiddleware, deleteCategory);

export default categoryRoutes;