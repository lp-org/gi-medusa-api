import { Router } from "express";
import {
  wrapHandler,
  buildQuery,
  transformStoreQuery,
  transformQuery,
  FindParams,
  FindPaginationParams,
} from "@medusajs/medusa";
import RoleRepository from "../../../repositories/role";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { validator } from "@medusajs/medusa/dist/utils/validator";

const router = Router();
router.get(
  "/",
  transformQuery(FindPaginationParams, {
    defaultFields: ["role_id"],
    defaultRelations: ["role"],
    isList: true,
  }),
  async (req, res) => {
    const { skip, take, relations } = req.listConfig;
    const count = await RoleRepository.count();
    const data = await RoleRepository.createQueryBuilder("role")

      .loadRelationCountAndMap("role.permissionsCount", "role.permissions")
      .getMany();
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
  "/",
  wrapHandler(async (req, res) => {
    req.user;
    const validated = await validator(AdminPostRolesReq, req.body);
    const data = RoleRepository.create(validated);
    const result = await RoleRepository.save(data);
    res.json(result);
  })
);

router.put(
  "/:role_id",
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

router.get(
  "/:role_id",
  wrapHandler(async (req, res) => {
    req.user;

    const data = await RoleRepository.findOne({
      where: { id: req.params.role_id },
      relations: { permissions: true },
    });

    res.json(data);
  })
);

router.delete(
  "/:role_id",
  wrapHandler(async (req, res) => {
    req.user;

    const data = await RoleRepository.delete({
      id: req.params.role_id,
    });

    res.json(data);
  })
);

export default router;
