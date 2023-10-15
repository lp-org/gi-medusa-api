import { Notification, Order, OrderEditService } from "@medusajs/medusa";
import CustomerService from "@medusajs/medusa/dist/services/customer";
import OrderService from "@medusajs/medusa/dist/services/order";
import { NotificationService } from "medusa-interfaces";
class OrderSubscriber {
  protected readonly customerService_: CustomerService;
  protected readonly orderService_: OrderService;
  protected readonly notificationService_: NotificationService;
  constructor({
    eventBusService,
    customerService,
    orderService,
    notificationService,
  }) {
    this.customerService_ = customerService;
    this.orderService_ = orderService;
    this.notificationService_ = notificationService;
    eventBusService.subscribe("order.placed", this.saveShippingAddress);
    // eventBusService.subscribe("order-edit.confirmed", (data) =>
    //   this.notificationService_.sendNotification(
    //     OrderEditService.Events.CONFIRMED,
    //     data
    //   )
    // );
  }

  saveShippingAddress = async ({ id }: { id: string }) => {
    const order = await this.orderService_.retrieve(id, {
      relations: ["shipping_address"],
    });

    const customer = await this.customerService_.retrieve(order.customer_id, {
      relations: ["shipping_addresses"],
    });
    if (customer.shipping_addresses.length == 0) {
      const { ...rest } = order.shipping_address;
      await this.customerService_.addAddress(customer.id, {
        ...rest,
      });
    }
  };
}

export default OrderSubscriber;
