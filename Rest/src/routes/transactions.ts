import { FastifyInstance } from "fastify";
import { setup } from "../database";
import { z } from "zod";
import crypto, { randomUUID } from "node:crypto";
import { checkSessionIdExists } from "../middleware/check-session-id-exist";

// cookies <--> context between api requisitions

export async function transactionRoutes(app: FastifyInstance) {
  app.get("/", { preHandler: [checkSessionIdExists] }, async (request) => {
    const sessionId = request.cookies.sessionId;
    const transactions = await setup("transactions")
      .where("session_id", sessionId)
      .select("*");

    return { transactions };
  });

  app.get("/:id", { preHandler: [checkSessionIdExists] }, async (request) => {
    const sessionId = request.cookies.sessionId;

    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = getTransactionParamsSchema.parse(request.params);

    const transaction = await setup("transactions")
      .where({ session_id: sessionId, id })
      .first();

    console.log("transaction test");
    return { transaction };
  });

  app.get(
    "/sumary",
    { preHandler: [checkSessionIdExists] },
    async (request) => {
      const sessionId = request.cookies.sessionId;

      const sumary = await setup("transactions")
        .sum("amount", { as: "amount" })
        .where("session_id", sessionId)
        .first();

      return { sumary };
    }
  );
  app.post("/", async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"]),
    });

    const { amount, title, type } = createTransactionBodySchema.parse(
      request.body
    );

    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();

      reply.cookie("sessionId", sessionId, {
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 7, //7 days
      });
    }

    await setup("transactions").insert({
      id: crypto.randomUUID(),
      title,
      amount: type === "credit" ? amount : amount * -1,
      session_id: sessionId,
    });

    return reply.status(201).send();
  });
}
