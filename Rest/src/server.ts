import fastify from "fastify";
import { setup } from "./database";


const app = fastify();
app.get("/hello", async () => {
  const tables = setup("sqlite_schema").select("*")

  return tables;
});

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("Server Running");
  });
