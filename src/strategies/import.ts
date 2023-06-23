import { AbstractBatchJobStrategy, BatchJobService } from "@medusajs/medusa";
import { EntityManager } from "typeorm";

class MyImportStrategy extends AbstractBatchJobStrategy {
  protected batchJobService_: BatchJobService;
  //   protected manager_: EntityManager;
  //   protected transactionManager_: EntityManager;
  static identifier = "product-import-strategy-backup";

  static batchType = "product-import-backup";
  async preProcessBatchJob(batchJobId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  processJob(batchJobId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  buildTemplate(): Promise<string> {
    throw new Error("Method not implemented.");
  }
}

export default MyImportStrategy;
