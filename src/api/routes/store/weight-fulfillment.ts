import { Router } from "express";
import WeightFulfillmentRepository from "../../../repositories/WeightFulfillment";
const router = Router();
router.get("/", async (req, res) => {
  const store = await WeightFulfillmentRepository.find();

  res.json(store);
});

export default router;
