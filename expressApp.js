import express from "express";

const app = express();
const PORT = 4000;

// B1: middleware to parse JSON bodies
app.use(express.json());

// B1 + B3: sample data (at least 3 items), stored in an array
let cart = [
  {
    id: 1,
    productName: "Wireless Mouse",
    price: 799,
    quantity: 2,
    category: "Electronics",
  },
  {
    id: 2,
    productName: "Notebook",
    price: 60,
    quantity: 5,
    category: "Stationery",
  },
  {
    id: 3,
    productName: "Water Bottle",
    price: 350,
    quantity: 1,
    category: "Lifestyle",
  },
];

// Adds totalPrice = price x quantity to an item (for responses only)
const withTotal = (item) => ({
  ...item,
  totalPrice: item.price * item.quantity,
});

// GET /cart -> retrieve all items
app.get("/cart", (req, res) => {
  res.json(cart.map(withTotal));
});

// GET /cart/:id -> retrieve one item
app.get("/cart/:id", (req, res) => {
  const item = cart.find((p) => p.id === Number(req.params.id));

  if (!item) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(withTotal(item));
});

// POST /cart -> add a new product
app.post("/cart", (req, res) => {
  const { id, productName, price, quantity, category } = req.body;

  if (
    id === undefined ||
    !productName ||
    typeof price !== "number" ||
    typeof quantity !== "number" ||
    !category
  ) {
    return res.status(400).json({
      message: "id, productName, price, quantity and category are required",
    });
  }

  if (cart.some((p) => p.id === id)) {
    return res
      .status(400)
      .json({ message: "Product with this ID already exists" });
  }

  const product = { id, productName, price, quantity, category };
  cart.push(product);
  res.status(201).json({ message: "Product added successfully", product });
});

// PUT /cart/:id -> update product details
app.put("/cart/:id", (req, res) => {
  const item = cart.find((p) => p.id === Number(req.params.id));

  if (!item) {
    return res.status(404).json({ message: "Product not found" });
  }

  const { productName, price, quantity, category } = req.body;

  if (
    !productName ||
    typeof price !== "number" ||
    typeof quantity !== "number" ||
    !category
  ) {
    return res.status(400).json({
      message: "productName, price, quantity and category are required",
    });
  }

  item.productName = productName;
  item.price = price;
  item.quantity = quantity;
  item.category = category;

  res.json({
    message: "Product updated successfully",
    product: withTotal(item),
  });
});

// DELETE /cart/:id -> remove a product
app.delete("/cart/:id", (req, res) => {
  const index = cart.findIndex((p) => p.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  cart.splice(index, 1);
  res.json({ message: "Product removed successfully" });
});

app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});

