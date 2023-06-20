import {
  FindParams,
  UserRoles,
  transformQuery,
  wrapHandler,
} from "@medusajs/medusa";
import { Router } from "express";
import InviteService from "../../../services/invite";
import { EntityManager } from "typeorm";
import { validator } from "@medusajs/medusa/dist/utils/validator";
import { IsEmail, IsEnum, IsString } from "class-validator";

export class AdminPostInvitesReq {
  @IsEmail()
  user: string;

  @IsString()
  role_id: string;
}

const router = Router();

router.get(
  "/",
  transformQuery(FindParams, {
    isList: true,
  }),
  wrapHandler(async (req, res) => {
    const { filterableFields, listConfig } = req;
    const inviteService: InviteService = req.scope.resolve("inviteService");
    const invites = await inviteService.list(filterableFields, listConfig);

    res.status(200).json({ invites });
  })
);

router.post(
  "/",
  wrapHandler(async (req, res) => {
    console.log(req.body);
    const validated = await validator(AdminPostInvitesReq, req.body);

    const inviteService: InviteService = req.scope.resolve("inviteService");

    const manager: EntityManager = req.scope.resolve("manager");
    await manager.transaction(async (transactionManager) => {
      return await inviteService
        .withTransaction(transactionManager)
        .createWithRoleId(validated.user, validated.role_id);
    });

    res.sendStatus(200);
  })
);

export default router;
