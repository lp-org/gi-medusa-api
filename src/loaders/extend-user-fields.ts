export default async function () {
  const imports = (await import(
    "@medusajs/medusa/dist/api/routes/admin/users/index"
  )) as any;
  imports.allowedAdminUsersFields = [
    ...imports.allowedAdminUsersFields,
    "role_id",
  ];
  imports.defaultAdminUsersFields = [
    ...imports.defaultAdminUsersFields,
    "role_id",
  ];
}
