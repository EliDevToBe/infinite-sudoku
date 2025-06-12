import http from "node:http";
import api from "./api";

const server = http.createServer(api);

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
