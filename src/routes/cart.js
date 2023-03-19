import { Router } from "express";
import { __dirname } from "../utils/utils.js";
import CartManager from "../dao/cartManager.js";

const router = Router();
const cm = new CartManager(`${__dirname}/files/carts.json`);

router.post("/", (req, res) => cm.addCart(req, res));

router.get("/:cid", (req, res) => cm.getCart(req, res));

router.post("/:cid/product/:pid", (req, res) => cm.addProduct(req, res));

export default router;