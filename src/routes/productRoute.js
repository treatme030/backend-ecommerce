import express from 'express';
import * as ctrl from '../controllers/productController';

const router = express.Router();

router.route("/products").get(ctrl.getAllProducts);
router.route("/products/new").post(ctrl.createProduct);
router.route("/products/:id").put(ctrl.updateProduct).delete(ctrl.deleteProduct).get(ctrl.getProductDetails);


export default router;