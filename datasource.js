const { Currency, Store } = require("@medusajs/medusa");
const { DataSource } = require("typeorm");

const dataSourceOptions = {
  type: "postgres",
  url: "postgresql://postgres:12345678@localhost:5432/medusa-store",
  extra: {},
  entities: [
    // "node_modules/@medusajs/medusa/dist/models/*.js",
    "dist/models/*.js",
  ],
  migrations: [
    // "node_modules/@medusajs/medusa/dist/migrations/*.js",
    "dist/migrations/*.js",
  ],
  synchronize: false,
};

module.exports = {
  datasource: new DataSource(dataSourceOptions),
};
