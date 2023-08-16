import http from "node:http";

const users = [
  {
    id: 1,
    name: "Darth",
    email: "a@a.com",
  },
];
const server = http.createServer(async (req, res) => {
  const { method, url } = req;
  console.log(method, url);

  const Buffers = [];
  for await (const chunk of req) {
    Buffers.push(chunk);
  }

  try {
    req.body = JSON.parse(Buffer.concat(Buffers).toString());
  } catch {
    req.body = null;
  }
  console.log(req.body);

  if (method === "GET" && url === "/users") {
    return res
      .setHeader("Content-type", "application/json")
      .end(JSON.stringify(users));
  }

  if (method === "POST" && url === "/users") {
    users.push({ id: users[users.length - 1].id + 1, ...req.body });

    return res.writeHead(201).end("create users");
  }
  return res.writeHead(404).end();
});

server.listen(3333);
