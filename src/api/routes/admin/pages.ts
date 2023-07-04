import { Router } from "express";
import {
  wrapHandler,
  transformQuery,
  FindPaginationParams,
} from "@medusajs/medusa";

import { IsString, IsBoolean, IsOptional } from "class-validator";
import { validator } from "@medusajs/medusa/dist/utils/validator";
import { buildQuery } from "@medusajs/medusa";
import PageRepository from "../../../repositories/page";
import { MedusaError } from "@medusajs/utils";
const router = Router();
router.get(
  "/",
  transformQuery(FindPaginationParams, {
    isList: true,
  }),
  async (req, res) => {
    const { skip, take, relations } = req.listConfig;
    const query = buildQuery({}, req.listConfig);
    const [data, count] = await PageRepository.findAndCount(query);

    res.json({
      count,
      data,
      offset: skip,
      limit: take,
    });
  }
);

export class AdminPostPageReq {
  @IsString()
  @IsOptional()
  title: string;
  @IsString()
  @IsOptional()
  handle: string;
  @IsString()
  @IsOptional()
  description: string;
  @IsString()
  @IsOptional()
  body: string;
  @IsBoolean()
  @IsOptional()
  publish: boolean;
}

router.post(
  "/",
  wrapHandler(async (req, res) => {
    req.user;
    const validated = await validator(AdminPostPageReq, req.body);
    const page = await PageRepository.findOne({
      where: { handle: validated.handle },
    });
    if (page) {
      throw new MedusaError(
        MedusaError.Types.DUPLICATE_ERROR,
        "Handle already exist"
      );
    }
    const data = PageRepository.create(validated);
    const result = await PageRepository.save(data);
    res.json(result);
  })
);

router.put(
  "/:page_id",
  wrapHandler(async (req, res) => {
    const validated = await validator(AdminPostPageReq, req.body);
    let data = await PageRepository.findOne({
      where: { id: req.params.page_id },
    });
    for (const key of Object.keys(validated)) {
      if (typeof validated[key] !== `undefined`) {
        data[key] = validated[key];
      }
    }
    const result = await PageRepository.save(data);
    res.json(result);
  })
);

router.get(
  "/:page_id",
  wrapHandler(async (req, res) => {
    const data = await PageRepository.findOne({
      where: { id: req.params.page_id },
    });

    res.json(data);
  })
);

router.delete(
  "/:page_id",
  wrapHandler(async (req, res) => {
    res.sendStatus(200);
  })
);

export default router;
