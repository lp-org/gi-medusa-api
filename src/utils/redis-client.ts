import { createClient } from "redis";
const client = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});
(async () => {
  await client.connect();
})();
client.on("error", (error) => console.error(`Error : ${error}`));
client.on("connect", () => console.info("redis connected"));
client.on("disconnect", () => console.info("redis disconnected"));
export default client;
