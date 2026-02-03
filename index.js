const Products = require("./model/product.model.jsx");
const { initializeDatabase } = require("./db/db.connect.js");
const express = require("express");
const fs = require("fs");
const Category = require("./model/category.model.jsx");

const app = express();
initializeDatabase();

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

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
    const product = await Products.find().populate("categoryField");
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

async function createCategoryData(newCategory) {
  try {
    const category = new Category(newCategory);
    return category.save();
  } catch (error) {
    throw error;
  }
}

app.post("/category", async (req, res) => {
  try {
    const category = await createCategoryData(req.body);
    if (category) {
      res
        .status(201)
        .json({ message: "Saved all Category inside the Product Schema" });
    }
    res.status(404).json({ error: "Category not created" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch Category Data", details: error.message });
  }
});

async function getAllCategoryData() {
  try {
    const category = await Category.find();
    return category;
  } catch (error) {
    throw error;
  }
}

app.get("/api/categories", async (req, res) => {
  try {
    const category = await getAllCategoryData();
    if (category) {
      res.status(201).json({ data: category });
    }
    res.status(404).json({ error: "Categories not found" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch Category Data", details: error.message });
  }
});

async function getCategoryByCategoryId(categoryId) {
  try {
    const category = await Category.findById(categoryId)
    return category;
  } catch (error) {
    throw error;
  }
}

app.get("/api/categories/:categoryId", async (req, res) => {
  try {
    const category = await getCategoryByCategoryId(req.params.categoryId);
    if (category) {
      res.status(200).json({ data: category });
    }
    res.status(404).json({ error: "Category Id not found" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch Category Data", details: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log("Server is running on this", PORT);
});
