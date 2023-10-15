export default async function () {
  const imports = (await import(
    "@medusajs/medusa/dist/api/routes/store/products/get-product"
  )) as any;
  const importsAdmin = (await import(
    "@medusajs/medusa/dist/api/routes/admin/products/index"
  )) as any;

  importsAdmin.defaultAdminProductFields = [
    ...importsAdmin.defaultAdminProductFields,
    "description_2",
  ];

  imports.allowedStoreProductsFields = [
    ...imports.allowedStoreProductsFields,
    "description_2",
  ];
  imports.defaultStoreProductsFields = [
    ...imports.defaultStoreProductsFields,
    "description_2",
  ];
}
