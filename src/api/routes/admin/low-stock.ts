import { wrapHandler } from "@medusajs/medusa";
import { Router } from "express";
import ProductLowStockRepository from "../../../repositories/productLowStock";

const router = Router();

router.get(
  "/",

  wrapHandler(async (req, res) => {
    const lowStockProducts = await ProductLowStockRepository.find({
      relations: { product: true, product_variant: true },
      order: {
        created_at: "DESC",
      },
    });

    res.status(200).json(lowStockProducts);
  })
);

router.get(
  "/count",

  wrapHandler(async (req, res) => {
    const lowStockProducts = await ProductLowStockRepository.count();

    res.status(200).json(lowStockProducts);
  })
);

export default router;
