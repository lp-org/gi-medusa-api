import { Router } from "express";
import PermissionRepository from "../../../repositories/permission";
const router = Router();
router.get(
  "/permissions",

  async (req, res) => {
    const data = await PermissionRepository.find();
    res.json({
      data,
    });
  }
);
