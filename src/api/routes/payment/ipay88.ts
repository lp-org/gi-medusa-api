import {
  AbstractCartCompletionStrategy,
  CartService,
  IdempotencyKeyService,
  wrapHandler,
} from "@medusajs/medusa";
import bodyParser from "body-parser";
import { Router } from "express";
import { sha256 } from "../../../utils/sha256";
import { EntityManager } from "typeorm";

type IPaymentResponseProps = {
  ActionType: string;
  Amount: string;
  AuthCode: string;
  CCCOriTokenId: string;
  Currency: string;
  DiscountedAmount: string;
  ErrDesc: string;
  HiddenToURL: string;
  MTLogId: string;
  MTVersion: string;
  MerchantCode: string;
  PaymentId: string;
  PromoCode: string;
  RefNo: string;
  Remark: string;
  Signature: string;
  Status: "0" | "1"; // 0 = failed, 1 = success
  TokenId: string;
  TransId: string;
};

type GenerateSignatureRequest = {
  MerchantCode: string;
  RefNo: string;
  Amount: string;
  Currency: string;
};

async function validateSignature(
  request: IPaymentResponseProps
): Promise<boolean> {
  const MerchantKey = process.env.IPAY88_MERCHANT_KEY;
  const str = `${MerchantKey}${request.MerchantCode}${request.PaymentId}${
    request.RefNo
  }${request.Amount.replace(".", "")}${request.Currency}${request.Status}`;
  return request.Signature === (await sha256(str));
}

const iPay88router = Router();
iPay88router.post(
  "/confirm",
  bodyParser.urlencoded({ extended: true }),
  wrapHandler(async (req, res) => {
    const request = req.body as IPaymentResponseProps;
    if (!(await validateSignature(request))) {
      res.status(400).json({ error: "Signature mismatch" });
      return;
    }
    const cartService: CartService = req.scope.resolve("cartService");
    const idempotencyKeyService: IdempotencyKeyService = req.scope.resolve(
      "idempotencyKeyService"
    );
    const cartCompleteStrat: AbstractCartCompletionStrategy = req.scope.resolve(
      "cartCompletionStrategy"
    );
    if (request.Status === "0") {
      res.status(400).json({ error: request.ErrDesc });
      return;
    }
    const manager: EntityManager = req.scope.resolve("manager");
    const result = await manager.transaction(async (transactionManager) => {
      const idempotencyKeyServiceTx =
        idempotencyKeyService.withTransaction(transactionManager);
      const cart = await cartService.retrieve(request.RefNo);
      let idempotencyKey = await idempotencyKeyServiceTx
        .retrieve({
          request_path: "/ipay88/hooks",
          idempotency_key: request.RefNo,
        })
        .catch(() => undefined);

      if (!idempotencyKey) {
        idempotencyKey = await idempotencyKeyService
          .withTransaction(transactionManager)
          .create({
            request_path: "/ipay88/hooks",
            idempotency_key: request.RefNo,
          });
      }

      return await cartCompleteStrat
        .withTransaction(transactionManager)
        .complete(request.RefNo, idempotencyKey, {
          ip: cart.context?.ip as string,
        });
    });
    const { response_body, response_code } = result;
    if (response_code === 200) {
      // @ts-ignore
      const order_id = response_body.data?.id as string;
      res.redirect(`${process.env.STORE_URL}/order/confirmed/${order_id}`);
    }
    res.json({ response_body, response_code });
  })
);

iPay88router.post(
  "/signature",
  bodyParser.json(),
  wrapHandler(async (req, res) => {
    const { Amount, Currency, MerchantCode, RefNo } =
      req.body as GenerateSignatureRequest;
    const MerchantKey = process.env.IPAY88_MERCHANT_KEY;
    const str = `${MerchantKey}${MerchantCode}${RefNo}${Amount.replace(
      ".",
      ""
    )}${Currency}`;

    res.json(await sha256(str));
  })
);

iPay88router.post(
  "/backend_response",
  bodyParser.urlencoded({ extended: true }),
  wrapHandler(async (req, res) => {
    console.log("------- WEBHOOK from IPAY88 --------- ");
    const request = req.body as IPaymentResponseProps;
    console.log(request);
    if (!(await validateSignature(request))) {
      res.status(400).json({ error: "Signature mismatch" });
      return;
    }
    if (request.Status === "0") {
      res.status(400).json({ error: request.ErrDesc });
      return;
    }
    const cartService: CartService = req.scope.resolve("cartService");
    const idempotencyKeyService: IdempotencyKeyService = req.scope.resolve(
      "idempotencyKeyService"
    );
    const cartCompleteStrat: AbstractCartCompletionStrategy = req.scope.resolve(
      "cartCompletionStrategy"
    );
    const manager: EntityManager = req.scope.resolve("manager");
    const result = await manager.transaction(async (transactionManager) => {
      const idempotencyKeyServiceTx =
        idempotencyKeyService.withTransaction(transactionManager);
      const cart = await cartService.retrieve(request.RefNo);
      let idempotencyKey = await idempotencyKeyServiceTx
        .retrieve({
          request_path: "/ipay88/hooks",
          idempotency_key: request.RefNo,
        })
        .catch(() => undefined);

      if (!idempotencyKey) {
        idempotencyKey = await idempotencyKeyService
          .withTransaction(transactionManager)
          .create({
            request_path: "/ipay88/hooks",
            idempotency_key: request.RefNo,
          });
      }

      return await cartCompleteStrat
        .withTransaction(transactionManager)
        .complete(request.RefNo, idempotencyKey, {
          ip: cart.context?.ip as string,
        });
    });
    const { response_body, response_code } = result;
    if (response_code === 200) {
      // @ts-ignore
      res.send("RECEIVEOK");
    }
    res.json({ response_body, response_code });
  })
);

export default iPay88router;
