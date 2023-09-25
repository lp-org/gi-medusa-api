import {
  AbstractFulfillmentService,
  Cart,
  Fulfillment,
  LineItem,
  Order,
  ShippingOptionService,
} from "@medusajs/medusa";
import { CreateReturnType } from "@medusajs/medusa/dist/types/fulfillment-provider";
import WeightFulfillmentRepository from "../repositories/weightFulfillment";
type InjectedDependencies = {
  shippingOptionService: ShippingOptionService;
};

class WeightFulfillmentService extends AbstractFulfillmentService {
  protected readonly shippingOptionService_: ShippingOptionService;
  constructor({ shippingOptionService }: InjectedDependencies) {
    super(arguments[0]);
    this.shippingOptionService_ = shippingOptionService;
  }
  static identifier = "weight";
  async getFulfillmentOptions(): Promise<any[]> {
    return [
      {
        id: "weight-fulfillment",
      },
      {
        id: "weight-fulfillment-return",
        is_return: true,
      },
    ];
  }

  async validateFulfillmentData(
    optionData: { [x: string]: unknown },
    data: { [x: string]: unknown },
    cart: Cart
  ): Promise<Record<string, unknown>> {
    if (optionData.id !== "weight-fulfillment") {
      throw new Error("invalid data");
    }
    const {
      totalWeight,
      initial_price,
      initial_weight,
      additional_price,
      every_additional_weight,
    } = await this.calculateWeight(cart, optionData.id);
    return {
      ...data,
      total_weight: totalWeight + "g",
      initial_price,
      initial_weight,
      additional_price,
      every_additional_weight,
    };
  }
  async validateOption(data: { [x: string]: unknown }): Promise<boolean> {
    return true;
  }
  async canCalculate(data: { [x: string]: unknown }): Promise<boolean> {
    return true;
  }
  async calculatePrice(
    optionData: { [x: string]: unknown },
    data: { [x: string]: unknown },
    cart: Cart
  ): Promise<number> {
    //RM 7 for 2kg and below, add RM 1 for every additional 1kg
    const id = optionData.id as string;
    // const totalWeight = cart.items.reduce((prev, curr) => {
    //   return prev + (curr.variant.weight || 0) * curr.quantity;
    // }, 0);
    // const metadata = await WeightFulfillmentRepository.findOne({
    //   where: { id },
    // });
    const { totalWeight, ...metadata } = await this.calculateWeight(cart, id);
    let initial_price = metadata.initial_price;
    const initial_weight = metadata.initial_weight;
    const additional_price = metadata.additional_price;
    const every_additional_weight = metadata.every_additional_weight;

    if (totalWeight > 2000) {
      initial_price +=
        Math.ceil((totalWeight - initial_weight) / every_additional_weight) *
        additional_price;
    }
    return initial_price;
  }
  async createFulfillment(
    data: Record<string, unknown>,
    items: LineItem[],
    order: Order,
    fulfillment: Fulfillment
  ): Promise<Record<string, unknown>> {
    return {};
  }
  async cancelFulfillment(fulfillment: { [x: string]: unknown }): Promise<any> {
    throw new Error("Method not implemented.");
  }
  async createReturn(
    returnOrder: CreateReturnType
  ): Promise<Record<string, unknown>> {
    throw new Error("Method not implemented.");
  }
  async getFulfillmentDocuments(data: { [x: string]: unknown }): Promise<any> {
    throw new Error("Method not implemented.");
  }
  async getReturnDocuments(data: Record<string, unknown>): Promise<any> {
    throw new Error("Method not implemented.");
  }
  async getShipmentDocuments(data: Record<string, unknown>): Promise<any> {
    throw new Error("Method not implemented.");
  }
  async retrieveDocuments(
    fulfillmentData: Record<string, unknown>,
    documentType: "invoice" | "label"
  ): Promise<any> {
    throw new Error("Method not implemented.");
  }

  private async calculateWeight(carts: Cart, id: string) {
    const totalWeight = carts.items.reduce((prev, curr) => {
      return prev + (curr.variant.weight || 0) * curr.quantity;
    }, 0);
    const metadata = await WeightFulfillmentRepository.findOne({
      where: { id },
    });
    return { totalWeight, ...metadata };
  }
}

export default WeightFulfillmentService;
