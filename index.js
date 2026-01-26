const Products = require("./model/product.model.jsx");
const { initializeDatabase } = require("./db/db.connect.js");
const express = require("express");
const fs = require("fs");

const app = express();
initializeDatabase();

app.use(express.json());

const jsonData = fs.readFileSync("./products.json", "utf-8");
const ProductsData = JSON.parse(jsonData);

async function seedData() {
  try {
    for (const ProductData of ProductsData) {
      const newProduct = new Products(ProductData);
      await newProduct.save();
    }
    console.log("All products saved successfully");
  } catch (error) {
    console.log("Error seeding the data:", error.message);
  }
}

// seedData()

async function getAllProductData() {
  try {
    const product = await Products.find();
    return product;
  } catch (error) {
    throw error;
  }
}

app.get("/api/products", async (req, res) => {
  try {
    const product = await getAllProductData();
    res.status(201).json({ data: product });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product Data" });
  }
});

async function getProductDetailByProductId(productId) {
  try {
    const product = await Products.findById(productId);
    console.log(product);
    return product;
  } catch (error) {
    throw error;
  }
}

app.get("/api/products/:productId", async (req, res) => {
  try {
    const product = await getProductDetailByProductId(req.params.productId);
    if (product) {
      return res.status(201).json({ data: product });
    }
    res.status(404).json({ error: "This product Id not found" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product Data" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log("Server is running on this", PORT);
});
