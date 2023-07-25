export const permissionList = [
  {
    name: "products.view",
    label: "View",
    endpoints: [
      { path: "/products", method: "GET" },
      { path: "/products/.+", method: "GET" },
    ],
  },
  {
    name: "products.add",
    label: "Add, Edit, Delete",
    endpoints: [
      { path: "/products", method: "POST" },
      { path: "/products/.+", method: "POST" },
      { path: "/products/.+", method: "DELETE" },
    ],
  },
  {
    name: "products.manage",
    label: "Manege product (variants, options)",
    endpoints: [
      {
        path: "products/.+/variants",
        method: "POST",
      },
      {
        path: "products/.+/variants/.+",
        method: "POST",
      },
      {
        path: "products/.+/options$",
        method: "POST",
      },
    ],
  },
  {
    name: "categories.view",
    label: "View",
    endpoints: [
      {
        path: "/product-categories",
        method: "GET",
      },
    ],
  },
  {
    name: "categories.add",
    label: "Add, Edit, Delete",
    endpoints: [
      { path: "/product-categories", method: "POST" },
      { path: "/product-categories/.+", method: "POST" },
      { path: "/product-categories/.+", method: "DELETE" },
    ],
  },
  {
    name: "orders.view",
    label: "View",
    endpoints: [
      { path: "/orders", method: "GET" },
      { path: "/orders/.+", method: "GET" },
    ],
  },
  {
    name: "orders.manage-order",
    label:
      "Manage order (completing, canceling, archiving, claims, exchange, return and fulfillment)",
    endpoints: [
      { path: "/orders/.+/cancel$", method: "POST" },
      { path: "/orders/.+/archive$", method: "POST" },
      { path: "/orders/.+/complete$", method: "POST" },
      { path: "/orders/.+/fulfillment$", method: "POST" },
      { path: "/orders/.+/claims$", method: "POST" },
      { path: "/orders/.+/return$", method: "POST" },
      { path: "/orders/.+/swaps$", method: "POST" },
    ],
  },
  {
    name: "orders.manage-payment",
    label: "Manage payment (capturing and refunding)",
    endpoints: [
      { path: "/orders/.+/refund$", method: "POST" },
      { path: "/orders/.+/capture$", method: "POST" },
    ],
  },
  {
    name: "customers.view",
    label: "View",
    endpoints: [
      { path: "/customers", method: "GET" },
      { path: "/customers/.+", method: "GET" },
    ],
  },
  {
    name: "discounts.view",
    label: "View",
    endpoints: [
      { path: "/discounts", method: "GET" },
      { path: "/discounts/.+", method: "GET" },
    ],
  },
  {
    name: "discounts.add",
    label: "Add",
    endpoints: [
      { path: "/discounts", method: "POST" },
      { path: "/discounts/.+", method: "PUT" },
    ],
  },
  {
    name: "pricings.view",
    label: "View",
    endpoints: [
      { path: "/pricings", method: "GET" },
      { path: "/pricings/.+", method: "GET" },
    ],
  },
  {
    name: "pricings.add",
    label: "Add",
    endpoints: [
      { path: "/pricings", method: "POST" },
      { path: "/pricings/.+", method: "PUT" },
    ],
  },
  {
    name: "gift-cards.add",
    label: "Add",
    endpoints: [
      { path: "/gift-cards", method: "POST" },
      { path: "/gift-cards/.+", method: "PUT" },
    ],
  },
  {
    name: "gift-cards.view",
    label: "View",
    endpoints: [
      { path: "/gift-cards", method: "GET" },
      { path: "/gift-cards/.+", method: "GET" },
    ],
  },
  {
    name: "pages.view",
    label: "View",
    endpoints: [
      {
        path: "/pages",
        method: "GET",
      },
    ],
  },
  {
    name: "pages.add",
    label: "Add, Edit, Delete",
    endpoints: [
      { path: "/pages", method: "POST" },
      { path: "/pages/.+", method: "POST" },
      { path: "/pages/.+", method: "DELETE" },
    ],
  },
  {
    name: "setting.reigons",
    label: "Reigons",
    endpoints: [
      // { path: "/regions", method: "GET" },
      // { path: "/regions/.+", method: "GET" },
    ],
  },
  {
    name: "setting.currencies",
    label: "Currencies",
    endpoints: [
      { path: "/currencies", method: "POST" },
      { path: "/currencies/.+", method: "POST" },
    ],
  },
  {
    name: "setting.store-details",
    label: "Store details",
  },
  {
    name: "setting.return-reasons",
    label: "Return reasons",
    endpoints: [
      { path: "/return-reasons", method: "GET" },
      { path: "/return-reasons", method: "POST" },
    ],
  },
  {
    name: "setting.the-team",
    label: "The team",
    endpoints: [
      { path: "/invites", method: "POST" },
      { path: "/invites/.+", method: "DELETE" },
      // { path: "/users", method: "GET" },
      // { path: "/users/.+", method: "GET" },
    ],
  },
  {
    name: "setting.roles",
    label: "Roles",
    endpoints: [
      { path: "/roles", method: "GET" },
      { path: "/roles/.+", method: "GET" },
      { path: "/roles", method: "POST" },
      { path: "/roles/.+", method: "PUT" },
    ],
  },

  {
    name: "setting.tax",
    label: "Tax",
    endpoints: [
      { path: "/regions/taxes", method: "GET" },
      // { path: "/regions/.+", method: "GET" },
    ],
  },
  {
    name: "setting.sales-channels",
    label: "Sales channels",
    endpoints: [
      { path: "/sales-channels", method: "GET" },
      { path: "/sales-channels/.+", method: "GET" },
      { path: "/sales-channels", method: "POST" },
    ],
  },
  {
    name: "setting.api-key-management",
    label: "API Key management",
    endpoints: [
      { path: "/publishable-api-keys", method: "GET" },
      { path: "/publishable-api-keys", method: "POST" },
    ],
  },
];
