import { Router } from "express";
import {
  wrapHandler,
  transformQuery,
  FindPaginationParams,
} from "@medusajs/medusa";
import RoleRepository from "../../../repositories/role";
import { IsString } from "class-validator";
import { validator } from "@medusajs/medusa/dist/utils/validator";
import { buildQuery } from "@medusajs/medusa";
import { MedusaError } from "@medusajs/utils";
import UserRepository from "../../../repositories/user";
import { EntityManager } from "typeorm";
import PermissionRepository from "../../../repositories/permission";
import InviteRepository from "../../../repositories/invite";
const router = Router();
router.get(
  "/",
  transformQuery(FindPaginationParams, {
    isList: true,
  }),
  async (req, res) => {
    const { skip, take, relations } = req.listConfig;
    const query = buildQuery({}, req.listConfig);

    const count = await RoleRepository.count();
    const data = await RoleRepository.createQueryBuilder("role")
      .setFindOptions(query)
      .loadRelationCountAndMap("role.permissionsCount", "role.permissions")
      .loadRelationCountAndMap("role.userCount", "role.users")
      .loadRelationCountAndMap("role.inviteCount", "role.invites")

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
    const user = await UserRepository.findOne({
      where: { role_id: req.params.role_id },
    });
    const invite = await InviteRepository.findOne({
      where: { role_id: req.params.role_id },
    });

    if (user || invite) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "Only when user not assign to this role can be deleted"
      );
    }
    const manager: EntityManager = req.scope.resolve("manager");
    await manager.transaction(async (transactionManager) => {
      const roleRepo = transactionManager.withRepository(RoleRepository);

      const role = await roleRepo.findOne({
        where: { id: req.params.role_id },
        relations: { permissions: true },
      });
      role.permissions = [];

      await roleRepo.save(role);

      await roleRepo.delete({
        id: req.params.role_id,
      });
    });

    res.sendStatus(200);
  })
);

export default router;
