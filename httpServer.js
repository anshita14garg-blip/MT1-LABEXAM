import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3000;

// Shopping cart stored in a JavaScript array (no database)
const cart = [
  { id: 1, productName: "Wireless Mouse", price: 799, quantity: 2 },
  { id: 2, productName: "Keyboard", price: 1299, quantity: 1 },
];

// Helper to send JSON responses
const sendJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};

// A1: Create the HTTP server
const server = http.createServer((req, res) => {
  const { method, url } = req;

  // A2: GET /  -> welcome message in HTML
  if (url === "/" && method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Welcome to the Shopping Cart Application</h1>");
  }

  // A3: GET /cart -> all cart items in JSON
  else if (url === "/cart" && method === "GET") {
    sendJSON(res, 200, cart);
  }

  // A2: GET /about -> application information
  else if (url === "/about" && method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(
      "<h2>About</h2><p>Shopping Cart Management application built using the Node.js HTTP module.</p>",
    );
  }

  // A4: GET /home -> serve index.html using the FS module
  else if (url === "/home" && method === "GET") {
    const filePath = path.join(__dirname, "public", "index.html");
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/html" });
        res.end("<h1>500 - Error reading file</h1>");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });
  }

  // A3: POST /add-to-cart -> add a product from a JSON body
  else if (url === "/add-to-cart" && method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const { id, productName, price, quantity } = JSON.parse(body);

        // A5: validate required fields
        if (
          id === undefined ||
          !productName ||
          typeof price !== "number" ||
          typeof quantity !== "number"
        ) {
          return sendJSON(res, 400, {
            message: "id, productName, price and quantity are required",
          });
        }

        const product = { id, productName, price, quantity };
        cart.push(product);
        sendJSON(res, 201, {
          message: "Product added to cart successfully",
          product,
        });
      } catch (error) {
        // invalid JSON
        sendJSON(res, 400, { message: "Invalid JSON in request body" });
      }
    });
  }

  // A5: any other route -> 404
  else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("<h1>404 - Page Not Found</h1>");
  }
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
