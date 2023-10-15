import { Router } from "express";
import OrderSerivce from "../../../services/order";
import LineItemService from "@medusajs/medusa/dist/services/line-item";
import LineItemRepository from "@medusajs/medusa/dist/repositories/line-item";
import { EntityManager, Between } from "typeorm";
import { IsInt, IsNumber, IsOptional, IsString } from "class-validator";
import {
  FindParams,
  buildQuery,
  transformQuery,
  wrapHandler,
  RequestQueryFields,
  normalizeQuery,
  PaymentStatus,
} from "@medusajs/medusa";
import OrderRepository from "../../../repositories/order";
import dayjs, { ManipulateType } from "dayjs";

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

  @IsString()
  @IsOptional()
  variant_id?: string;
}

type LabelValue = {
  label: string;
  value: number;
};

function isPaymentSuccess(payment_status: PaymentStatus) {
  if (
    payment_status === PaymentStatus.CAPTURED ||
    payment_status === PaymentStatus.REFUNDED ||
    payment_status === PaymentStatus.PARTIALLY_REFUNDED
  ) {
    return true;
  }
  return false;
}

router.get(
  "/",
  transformQuery(SummaryQuery, {
    isList: true,
  }),
  async (req, res) => {
    /**
     *  day < 3 ; hour
     *  day < 93 ; day
     *  day < 1830 ; month
     *  else year
     */

    const {
      currency_code,
      start_date,
      end_date,
      sales_channel_id,
      variant_id,
    } = req.filterableFields;

    const duration = dayjs(end_date as string).diff(
      start_date as string,
      "day"
    );
    let interval: ManipulateType = "day";
    if (duration < 3) {
      interval = "hour";
    } else if (duration < 93) {
      interval = "day";
    } else if (duration < 1830) {
      interval = "month";
    } else {
      interval = "year";
    }

    const manager: EntityManager = req.scope.resolve("manager");
    const orderService: OrderSerivce = req.scope.resolve("orderService");
    const lineItemService: LineItemService =
      req.scope.resolve("lineItemService");
    const lineItemRepository: typeof LineItemRepository =
      req.scope.resolve("lineItemRepository");
    const data = await manager.transaction(async (transactionManager) => {
      let totalSales = 0;
      let totalAwaiting = 0;
      let totalRefunded = 0;
      const orders = await orderService.list({
        created_at: {
          gte: new Date(start_date as string),
          lt: new Date(
            dayjs(end_date as string)
              .add(1, "day")
              .toISOString()
          ),
        },
        currency_code,
        sales_channel_id,
      });
      const salesByMonth = {};

      // line item list
      if (variant_id) {
        // const lineItems = await lineItemService.list(
        //   // @ts-ignore
        //   { variant_id: variant_id.split(",") },
        //   { relations: ["order"] }
        // );
        const q = lineItemRepository
          .createQueryBuilder("lineItem")
          .leftJoinAndSelect("lineItem.order", "order")
          .andWhere("variant_id IN (:...variant_id)", {
            // @ts-ignore
            variant_id: variant_id.split(","),
          })
          .andWhere("order.currency_code = :currency_code", { currency_code })
          .andWhere("order.sales_channel_id = :sales_channel_id", {
            sales_channel_id,
          })
          .andWhere("order_id is NOT NULL")
          //   (created_at: {
          //   gte: new Date(start_date as string),
          //   lt: new Date(
          //     dayjs(end_date as string)
          //       .add(1, "day")
          //       .toISOString()
          //   ),
          // },
          .andWhere("order.created_at >= :start_date", {
            start_date: new Date(start_date as string),
          })
          .andWhere("order.created_at < :end_date", {
            end_date: new Date(
              dayjs(end_date as string)
                .add(1, "day")
                .toISOString()
            ),
          });
        const lineItems = await q.getMany();

        for (const sale of lineItems) {
          if (sale.order) {
            const payment_status = sale.order.payment_status;
            if (
              payment_status === PaymentStatus.CAPTURED ||
              payment_status === PaymentStatus.REFUNDED ||
              payment_status === PaymentStatus.PARTIALLY_REFUNDED
            ) {
              const date = dayjs(sale.created_at)
                .startOf(interval)
                .toISOString();
              totalRefunded += sale.order.refunded_total;
              totalSales += sale.unit_price * sale.quantity;
              if (!salesByMonth[date]) {
                salesByMonth[date] = 0;
              }

              salesByMonth[date] += sale.unit_price * sale.quantity;
            } else if (payment_status === PaymentStatus.AWAITING) {
              totalAwaiting += sale.unit_price * sale.quantity;
            }
          }
        }
      } else {
        // Group sales by month
        for (const sale of orders) {
          const payment_status = sale.payment_status;
          if (
            payment_status === PaymentStatus.CAPTURED ||
            payment_status === PaymentStatus.REFUNDED ||
            payment_status === PaymentStatus.PARTIALLY_REFUNDED
          ) {
            const date = dayjs(sale.created_at).startOf(interval).toISOString();
            totalRefunded += sale.refunded_total;
            totalSales += sale.total;
            if (!salesByMonth[date]) {
              salesByMonth[date] = 0;
            }

            salesByMonth[date] += sale.total;
          } else if (payment_status === PaymentStatus.AWAITING) {
            totalAwaiting += sale.total;
          }
        }
      }
      const result: LabelValue[] = [];

      // const salesByMonth = {};
      let cursor = dayjs(start_date as string).startOf(interval);
      while (cursor.isBefore(dayjs(end_date as string).endOf("day"))) {
        result.push({
          label: cursor.toISOString(),
          value: salesByMonth[cursor.toISOString()] || 0,
        });
        cursor = cursor.add(1, interval);
      }

      return { result, totalSales, totalRefunded, totalAwaiting };
    });

    res.json({ duration, interval, ...data });
  }
);

export default router;
