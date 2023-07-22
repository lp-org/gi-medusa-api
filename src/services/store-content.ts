import { Lifetime } from "awilix";
import { TransactionBaseService } from "@medusajs/medusa";
import { IEventBusService } from "@medusajs/types";
import StoreContentRepository from "../repositories/storeContent";

export default class StoreContentService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly eventBusService_: IEventBusService;

  constructor(
    { eventBusService }: { eventBusService: IEventBusService },
    options: Record<string, unknown>
  ) {
    // @ts-ignore
    super(...arguments);

    this.eventBusService_ = eventBusService;
  }

  async get() {
    return await this.atomicPhase_(async (manager) => {
      const storeContentRepo = this.activeManager_.withRepository(
        StoreContentRepository
      );

      const storeContent = await storeContentRepo.find({
        relations: {
          store: true,
        },
      });
      return storeContent[0];
    });
  }
}
