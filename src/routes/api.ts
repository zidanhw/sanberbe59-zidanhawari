import categoriesController from "../controllers/categories.controller";
import productsController from "../controllers/products.controller";
import uploadController from "../controllers/upload.controller";
import uploadMiddleware from "../middleware/upload.middleware";
import authController from "../controllers/auth.controller";
import authMiddleware from "../middleware/auth.middleware";
import rbacMiddleware from "../middleware/rbac.middleware";
import ordersController from "../controllers/orders.controller";


import express from "express";

const router = express.Router();

// Categories
router.get("/categories", categoriesController.findAll);
router.post("/categories", categoriesController.create);
router.get("/categories/:id", categoriesController.findOne);
router.put("/categories/:id", categoriesController.update);
router.delete("/categories/:id", categoriesController.delete);

// Products
router.get("/products", productsController.findAll);
router.post("/products", authMiddleware, productsController.create);
router.get("/products/:id", productsController.findOne);
router.put("/products/:id", productsController.update);
router.delete("/products/:id", productsController.delete);

// Authentication
router.post("/auth/login", authController.login);
router.post("/auth/register", authController.register);


router.post(
  "/auth/me",
  [authMiddleware, rbacMiddleware(["admin"])],
  authController.me
);

// router.post("/auth/me", authMiddleware, authController.me);

router.put("/auth/update-profile", authMiddleware, authController.updateProfile);

// Order
router.get("/orders", authMiddleware, ordersController.findAll)
router.post("/orders", authMiddleware, ordersController.create);

// Upload
router.post("/upload", uploadMiddleware.single, uploadController.single);
router.post("/uploads", uploadMiddleware.multiple, uploadController.multiple);

export default router;
