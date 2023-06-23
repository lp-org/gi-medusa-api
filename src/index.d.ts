import { Role } from "./models/Role";

export declare module "@medusajs/medusa/dist/models/user" {
  declare interface User {
    role_id: string;
    teamRole: Role;
  }
}
