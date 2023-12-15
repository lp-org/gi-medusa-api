import { TextEncoder } from "util";

import { createHash } from "crypto";
// nodejs serverside
export async function sha256(message: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hash = createHash("sha256");
  hash.update(data);
  const digest = hash.digest("hex");
  return digest;
}
