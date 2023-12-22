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
    return {};
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
    return {
      status: PaymentSessionStatus.AUTHORIZED,
      data: paymentSessionData,
    };
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
        cart_id: context.resource_id,
        cart: cart,
        total: context.amount,
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

  /**
   * 
   * @param paymentSessionData 
   * 00 Successful payment
Invalid parameters Parameters pass in incorrect
Record not found Cannot found the record
Incorrect amount Amount different
Payment fail Payment fail
M88Admin Payment status updated by iPay88 Admin(Fail)
   * @returns 
   */
  async getPaymentStatus(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentSessionStatus> {
    console.log("getPaymentStatus", paymentSessionData);
    if (paymentSessionData.code === "Payment Fail")
      return PaymentSessionStatus.ERROR;
    else if (paymentSessionData.code === "00")
      return PaymentSessionStatus.AUTHORIZED;
    else return PaymentSessionStatus.ERROR;
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
    const amt: number = (paymentSessionData as any).total;

    const payload = {
      MerchantCode: process.env.IPAY88_MERCHANT_CODE,
      RefNo: paymentSessionData.cart_id,
      Amount: ((amt as number) / 100).toFixed(2),
    };
    // @ts-ignore
    const res = await fetch(
      "https://payment.ipay88.com.my/epayment/enquiry.asp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        // @ts-ignore
        body: new URLSearchParams(payload),
      }
    );
    console.log(
      "Requery https://payment.ipay88.com.my/epayment/enquiry.asp with Payload:"
    );
    console.log(payload);
    const result = {
      code: await res.text(),
    };
    console.log("Requery result: ", result.code);
    return result;
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
        total: context.amount,
        cart_id: context.resource_id,
        cart: cart,
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
