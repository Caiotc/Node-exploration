import http from "node:http";

// criate an user( name,email, ...)

const users = [];
const server = http.createServer((req, res) => {
  const { method, url } = req;
  console.log(method, url);

  if (method === "GET" && url === "/users") {
    return res
      .setHeader("Content-type", "application/json")
      .end(JSON.stringify(users));
  }

  if (method === "POST" && url === "/users") {
    users.push({
      id: 1,
      name: "Darth",
      email: "a@a.com",
    });
    return res.end("create users");
  }
  return res.end("Hello World");
});

server.listen(3333);
