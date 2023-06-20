import {
  AdminUpdateUserRequest,
  FindPaginationParams,
  FindParams,
  transformQuery,
  wrapHandler,
} from "@medusajs/medusa";
import { Router } from "express";
import { validator } from "@medusajs/medusa/dist/utils/validator";
import { EntityManager } from "typeorm";
import UserService from "../../../services/user";
import { IsOptional, IsString } from "class-validator";

class AdminUpdateUserV2Request extends AdminUpdateUserRequest {
  @IsString()
  @IsOptional()
  role_id?: string;
}
const router = Router();

router.get(
  "/",
  transformQuery(FindParams, {
    isList: true,
  }),
  wrapHandler(async (req, res) => {
    const { filterableFields, listConfig } = req;
    const userService: UserService = req.scope.resolve("userService");
    const users = await userService.list(filterableFields, listConfig);

    res.status(200).json({ users });
  })
);

router.post(
  "/:user_id",
  wrapHandler(async (req, res) => {
    const { user_id } = req.params;

    const validated = await validator(AdminUpdateUserV2Request, req.body);

    const userService: UserService = req.scope.resolve("userService");
    const manager: EntityManager = req.scope.resolve("manager");
    const data = await manager.transaction(async (transactionManager) => {
      return await userService
        .withTransaction(transactionManager)
        .update(user_id, validated);
    });

    res.status(200).json({ user: data });
  })
);

export default router;
