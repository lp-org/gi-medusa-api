import { Router } from "express";
import PermissionRepository from "../../../repositories/permission";
import {
  FindParams,
  buildQuery,
  extendedFindParamsMixin,
  transformQuery,
  wrapHandler,
} from "@medusajs/medusa";
import { IsArray, IsOptional, IsString, ValidateNested } from "class-validator";
import { buildRelations } from "@medusajs/utils";
import RoleRepository from "../../../repositories/role";
import { validator } from "@medusajs/medusa/dist/utils/validator";
import { Permission } from "../../../models/Permission";

const router = Router();

class AdminPermissionGetParams extends extendedFindParamsMixin({
  limit: 20,
  offset: 0,
}) {
  @IsString()
  @IsOptional()
  "role_id"?: string;
}

// class Permission {
//   @IsString()
//   id: string;
// }
class AdminPermissionRolePostParams {
  @IsArray()
  "permission"?: Permission[];
}

router.get(
  "/",
  transformQuery(AdminPermissionGetParams, {
    defaultFields: ["role_id"],

    isList: true,
  }),
  wrapHandler(async (req, res) => {
    const { filterableFields } = req;

    const data = await PermissionRepository.find({ order: { order: "asc" } });
    res.json(data);
  })
);

router.put(
  "/role/:roleId",
  wrapHandler(async (req, res) => {
    const validated = await validator(AdminPermissionRolePostParams, req.body);
    const role = await RoleRepository.findOne({
      where: { id: req.params.roleId },
      relations: { permissions: true },
    });
    // delete role.permissions;

    // const data = await RoleRepository.({
    //   permissions: validated.permission,

    // },{data:});
    role.permissions = validated.permission;
    RoleRepository.save(role);

    res.json(role);
  })
);

export default router;
