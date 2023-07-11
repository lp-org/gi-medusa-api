import { Router } from "express";
import OrderSerivce from "../../../services/order";
import { EntityManager, Between } from "typeorm";
import { IsInt, IsNumber, IsOptional, IsString } from "class-validator";
import {
  FindParams,
  buildQuery,
  transformQuery,
  wrapHandler,
  RequestQueryFields,
  normalizeQuery,
} from "@medusajs/medusa";
import OrderRepository from "../../../repositories/order";

const router = Router();

class SummaryQuery extends FindParams {
  @IsString()
  currency_code: string;

  @IsString()
  start_date: string;

  @IsString()
  end_date: string;

  @IsString()
  @IsOptional()
  sales_channel_id?: string;
}

router.get(
  "/",
  transformQuery(SummaryQuery, {
    isList: true,
  }),
  async (req, res) => {
    console.log(req.filterableFields);
    const { currency_code, start_date, end_date, sales_channel_id } =
      req.filterableFields;
    const manager: EntityManager = req.scope.resolve("manager");
    const orderService: OrderSerivce = req.scope.resolve("orderService");
    const orderRepo: typeof OrderRepository =
      req.scope.resolve("orderRepository");
    const data = await manager.transaction(async (transactionManager) => {
      // const orders = await OrderRepository.find({
      //   where: {
      //     created_at: Between(
      //       new Date(start_date as string),
      //       new Date(end_date as string)
      //     ),
      //   },
      // });
      const orders = await orderService.list({
        created_at: {
          gte: new Date(start_date as string),
          lte: new Date(end_date as string),
        },
      });
      const salesByMonth = {};

      // Group sales by month
      for (const sale of orders) {
        const monthYear = sale.created_at.toISOString().substring(0, 10); // Extracting the YYYY-MM part from the created_at timestamp

        if (!salesByMonth[monthYear]) {
          salesByMonth[monthYear] = 0;
        }

        salesByMonth[monthYear] += sale.total;
      }
      return salesByMonth;
      // const salesByMonth = {};

      // // Group sales by month
      // for (const sale of orders) {
      //   const monthYear = sale.created_at.toISOString().substr(0, 7); // Extracting the YYYY-MM part from the created_at timestamp

      //   if (!salesByMonth[monthYear]) {
      //     salesByMonth[monthYear] = 0;
      //   }

      //   salesByMonth[monthYear] += sale.amount;
      // }
    });
    res.json(data);
  }
);

export default router;
