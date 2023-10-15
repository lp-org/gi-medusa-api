import { Lifetime } from "awilix";
import { isDefined, MedusaError } from "@medusajs/utils";
import {
  Cart,
  LineItem,
  LineItemTaxLine,
  NewTotalsService as MedusaNewTotalsService,
  Order,
  calculatePriceTaxAmount,
} from "@medusajs/medusa";
import TaxInclusivePricingFeatureFlag from "@medusajs/medusa/dist/loaders/feature-flags/tax-inclusive-pricing";
import { isOrder } from "@medusajs/medusa/dist/types/orders";
import {
  ITaxCalculationStrategy,
  TaxCalculationContext,
  TransactionBaseService,
} from "@medusajs/medusa/dist/interfaces";
import {
  LineAllocationsMap,
  SubtotalOptions,
} from "@medusajs/medusa/dist/types/totals";
type LineItemTotalsOptions = {
  include_tax?: boolean;
  use_tax_lines?: boolean;
  exclude_gift_cards?: boolean;
  calculation_context?: TaxCalculationContext;
};
type LineItemTotals = {
  unit_price: number;
  quantity: number;
  subtotal: number;
  tax_total: number;
  total: number;
  original_total: number;
  original_tax_total: number;
  tax_lines: LineItemTaxLine[];
  discount_total: number;

  raw_discount_total: number;
};

export default class NewTotalsService extends MedusaNewTotalsService {
  //   static LIFE_TIME = Lifetime.SCOPED

  /**
   * Calculate and return the totals for an item
   * @param item
   * @param includeTax
   * @param lineItemAllocation
   * @param taxLines Only needed to force the usage of the specified tax lines, often in the case where the item does not hold the tax lines
   * @param calculationContext
   */
  protected async getLineItemTotals_(
    item: LineItem,
    {
      includeTax,
      lineItemAllocation,
      taxLines,
      calculationContext,
    }: {
      includeTax?: boolean;
      lineItemAllocation: LineAllocationsMap[number];
      taxLines?: LineItemTaxLine[];
      calculationContext: TaxCalculationContext;
    }
  ): Promise<LineItemTotals> {
   
    let subtotal = item.unit_price * item.quantity;
  
    
    if (
      this.featureFlagRouter_.isFeatureEnabled(
        TaxInclusivePricingFeatureFlag.key
      ) &&
      item.includes_tax
    ) {
      subtotal = 0; // in that case we need to know the tax rate to compute it later
    }

    const raw_discount_total = lineItemAllocation.discount?.amount ?? 0;
    const discount_total = Math.round(raw_discount_total);

    const totals: LineItemTotals = {
      unit_price: item.unit_price,
      quantity: item.quantity,
      subtotal,
      discount_total,
      total: subtotal - discount_total,
      original_total: subtotal,
      original_tax_total: 0,
      tax_total: 0,
      tax_lines: item.tax_lines ?? [],

      raw_discount_total: raw_discount_total,
    };

    if (includeTax) {
      totals.tax_lines = totals.tax_lines.length
        ? totals.tax_lines
        : (taxLines as LineItemTaxLine[]);

      if (!totals.tax_lines && item.variant_id) {
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          "Tax Lines must be joined to calculate taxes"
        );
      }
    }

    if (item.is_return) {
      if (!isDefined(item.tax_lines) && item.variant_id) {
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          "Return Line Items must join tax lines"
        );
      }
    }

    if (totals.tax_lines?.length > 0) {
      totals.tax_total = await this.taxCalculationStrategy_.calculate(
        [item],
        totals.tax_lines,
        calculationContext
      );

      const noDiscountContext = {
        ...calculationContext,
        allocation_map: {}, // Don't account for discounts
      };

      totals.original_tax_total = await this.taxCalculationStrategy_.calculate(
        [item],
        totals.tax_lines,
        noDiscountContext
      );

      if (
        this.featureFlagRouter_.isFeatureEnabled(
          TaxInclusivePricingFeatureFlag.key
        ) &&
        item.includes_tax
      ) {
        totals.subtotal +=
          totals.unit_price * totals.quantity - totals.original_tax_total;
        totals.total += totals.subtotal;
        totals.original_total += totals.subtotal;
      }

      totals.total += totals.tax_total;
      totals.original_total += totals.original_tax_total;
    }

    return totals;
  }
}
