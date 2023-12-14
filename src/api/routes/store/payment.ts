import { Router } from "express";
import PageRepository from "../../../repositories/page";
import { MedusaError } from "@medusajs/utils";
import { wrapHandler } from "@medusajs/medusa";
const router = Router();
router.post(
  "/confirm",
  wrapHandler(async (req, res) => {
    res.json(req.body);
  })
);

export default router;
