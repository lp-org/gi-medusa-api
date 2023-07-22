const dotenv = require("dotenv");

let ENV_FILE_NAME = "";
switch (process.env.NODE_ENV) {
  case "production":
    ENV_FILE_NAME = ".env.production";
    break;
  case "staging":
    ENV_FILE_NAME = ".env.staging";
    break;
  case "test":
    ENV_FILE_NAME = ".env.test";
    break;
  case "development":
  default:
    ENV_FILE_NAME = ".env";
    break;
}

try {
  dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME });
} catch (e) {}

// CORS when consuming Medusa from admin
const ADMIN_CORS =
  process.env.ADMIN_CORS || "http://localhost:7000,http://localhost:7001";

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS || "http://localhost:8000";

const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://localhost/medusa-store";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  {
    resolve: `medusa-payment-stripe`,
    options: {
      api_key: process.env.STRIPE_SECRET_KEY,
      webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
    },
  },
  {
    resolve: `@medusajs/file-local`,
    options: {
      upload_dir: "uploads",
      backend_url: process.env.BACKEND_URL || "http://localhost:9000",
    },
  },
  // {
  //   resolve: `medusa-plugin-ses`,
  //   options: {
  //     access_key_id: process.env.SES_ACCESS_KEY_ID,
  //     secret_access_key: process.env.SES_SECRET_ACCESS_KEY,
  //     region: process.env.SES_REGION,
  //     from: process.env.SES_FROM,
  //     enable_endpoint: process.env.SES_ENABLE_ENDPOINT,
  //     template_path: process.env.SES_TEMPLATE_PATH,
  //     order_placed_template: "order_placed",
  //     order_shipped_template: "order_shipped",
  //     user_password_reset_template: "user_password_reset",
  //     gift_card_created_template: "gift_card_created",
  //     //order_canceled_template: 'order_canceled',
  //     //order_refund_created_template: 'order_refund_created',
  //     //order_return_requested_template: 'order_return_requested',
  //     //order_items_returned_template: 'order_items_returned',
  //     //swap_created_template: 'swap_created',
  //     //swap_shipment_created_template: 'swap_shipment_created',
  //     //swap_received_template: 'swap_received',
  //     //claim_shipment_created_template: 'claim_shipment_created',
  //     //medusa_restock_template: 'medusa_restock',
  //   },
  // },
  // To enable the admin plugin, uncomment the following lines and run `yarn add @medusajs/admin`
  // {
  //   resolve: "@medusajs/admin",
  //   /** @type {import('@medusajs/admin').PluginOptions} */
  //   options: {
  //     autoRebuild: true,
  //   },
  // },
];

const modules = {
  eventBus: {
    resolve: "@medusajs/event-bus-redis",
    options: {
      redisUrl: REDIS_URL,
    },
  },
  cacheService: {
    resolve: "@medusajs/cache-redis",
    options: {
      redisUrl: REDIS_URL,
    },
  },
  // inventoryService: "@medusajs/inventory",
  // stockLocationService: "@medusajs/stock-location",
};

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
  jwtSecret: process.env.JWT_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,
  store_cors: STORE_CORS,
  database_url: DATABASE_URL,
  admin_cors: ADMIN_CORS,
  // Uncomment the following lines to enable REDIS
  redis_url: REDIS_URL,
  upload_dir: "uploads",
  backend_url: process.env.BACKEND_URL || "http://localhost:9000",
};

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig,
  plugins,
  modules,
  featureFlags: {
    product_categories: true,
    tax_inclusive_pricing: true,
  },
};
