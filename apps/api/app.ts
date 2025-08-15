import http from "node:http";
import api from "./api/index.js";

const server = http.createServer(api);

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
