import { Router } from "express";
import {
  wrapHandler,
  buildQuery,
  transformStoreQuery,
  transformQuery,
  FindParams,
  FindPaginationParams,
} from "@medusajs/medusa";
import { MedusaError } from "medusa-core-utils";
import RoleRepository from "../../../repositories/role";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { validator } from "@medusajs/medusa/dist/utils/validator";

const router = Router();
router.get(
  "/roles",
  transformQuery(FindPaginationParams, { isList: true }),
  async (req, res) => {
    const { skip, take, relations } = req.listConfig;
    const count = await RoleRepository.count();
    const data = await RoleRepository.find(buildQuery({}, req.listConfig));
    res.json({
      count,
      data,
      offset: skip,
      limit: take,
    });
  }
);

export class AdminPostRolesReq {
  @IsString()
  name: string;
}

router.post(
  "/roles",
  wrapHandler(async (req, res) => {
    req.user;
    const validated = await validator(AdminPostRolesReq, req.body);
    const data = RoleRepository.create(validated);
    const result = await RoleRepository.save(data);
    res.json(result);
  })
);

router.put(
  "/roles/:role_id",
  wrapHandler(async (req, res) => {
    req.user;
    const validated = await validator(AdminPostRolesReq, req.body);
    const data = await RoleRepository.findOne({
      where: { id: req.params.role_id },
    });
    data.name = validated.name;
    const result = await RoleRepository.save(data);
    res.json(result);
  })
);

export default router;
