import fastify from "fastify";
import crypto from 'node:crypto'
import { setup } from "./database";


const app = fastify();
app.get("/hello", async () => {
  const transactions = setup("transactions").insert({
    id: crypto.randomUUID(),
    title:'Test transaction',
    amount:1000,
  }).returning('*')

  return transactions;
});

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("Server Running");
  });
