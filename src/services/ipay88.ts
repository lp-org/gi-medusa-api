// Merchant Code: M42593
// Merchant Key: mRncgj469i
import {
  AbstractPaymentProcessor,
  CartService,
  PaymentProcessorContext,
  PaymentProcessorError,
  PaymentProcessorSessionResponse,
  PaymentSessionStatus,
} from "@medusajs/medusa";

class IPay88Processor extends AbstractPaymentProcessor {
  protected readonly cartService_: CartService;
  static identifier = "ipay88";
  constructor({ cartService }: { cartService: CartService }) {
    // @ts-ignore
    super(...arguments);
    this.cartService_ = cartService;
  }

  async capturePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<Record<string, unknown> | PaymentProcessorError> {
    return;
  }
  async authorizePayment(
    paymentSessionData: Record<string, unknown>,
    context: Record<string, unknown>
  ): Promise<
    | PaymentProcessorError
    | {
        status: PaymentSessionStatus;
        data: Record<string, unknown>;
      }
  > {
    throw new Error("Method not implemented.");
  }
  async cancelPayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<Record<string, unknown> | PaymentProcessorError> {
    throw new Error("Method not implemented.");
  }
  async initiatePayment(
    context: PaymentProcessorContext
  ): Promise<PaymentProcessorError | PaymentProcessorSessionResponse> {
    const cart = await this.cartService_.retrieve(context.resource_id, {
      relations: ["billing_address"],
    });

    return {
      session_data: {
        customer: context.customer,
        billing_address: cart.billing_address,
        currency: context.currency_code,
      },
    };
  }
  async deletePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<Record<string, unknown> | PaymentProcessorError> {
    return {};
  }
  async getPaymentStatus(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentSessionStatus> {
    throw new Error("Method not implemented.");
  }
  async refundPayment(
    paymentSessionData: Record<string, unknown>,
    refundAmount: number
  ): Promise<Record<string, unknown> | PaymentProcessorError> {
    throw new Error("Method not implemented.");
  }
  async retrievePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<Record<string, unknown> | PaymentProcessorError> {
    throw new Error("Method not implemented.");
  }
  async updatePayment(
    context: PaymentProcessorContext
  ): Promise<void | PaymentProcessorError | PaymentProcessorSessionResponse> {
    const cart = await this.cartService_.retrieve(context.resource_id, {
      relations: ["billing_address"],
    });

    return {
      session_data: {
        customer: context.customer,
        billing_address: cart.billing_address,
        currency: context.currency_code,
      },
    };
  }
  async updatePaymentData(
    sessionId: string,
    data: Record<string, unknown>
  ): Promise<Record<string, unknown> | PaymentProcessorError> {
    throw new Error("Method not implemented.");
  }
}

export default IPay88Processor;
