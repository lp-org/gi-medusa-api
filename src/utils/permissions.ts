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
    label: "Add",
    endpoints: [
      { path: "/products", method: "POST" },
      { path: "/products/.+", method: "PUT" },
    ],
  },
  {
    name: "products.manage",
    label: "Manege product (edit, delete, unpublish...)",
    endpoints: [],
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
    label: "Manage order",
    endpoints: [],
  },
  {
    name: "orders.manage-payment",
    label: "Manage payment",
    endpoints: [],
  },
  {
    name: "customers.view",
    label: "View",
    endpoints: [
      { path: "/customers", method: "POST" },
      { path: "/customers/.+", method: "PUT" },
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
    name: "setting.reigons",
    label: "Reigons",
  },
  {
    name: "setting.currencies",
    label: "Currencies",
  },
  {
    name: "setting.store-details",
    label: "Store details",
  },
  {
    name: "setting.return-reasons",
    label: "Return reasons",
  },
  {
    name: "setting.the-team",
    label: "The team",
  },
  {
    name: "setting.roles",
    label: "Roles",
  },
  {
    name: "setting.personal-information",
    label: "Personal information",
  },
  {
    name: "setting.tax",
    label: "Tax",
  },
  {
    name: "setting.sales-channels",
    label: "Sales channels",
  },
  {
    name: "setting.api-key-management",
    label: "API Key management",
  },
];
