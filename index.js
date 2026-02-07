const Products = require("./model/product.model.jsx");
const { initializeDatabase } = require("./db/db.connect.js");
const express = require("express");
const fs = require("fs");
const Category = require("./model/category.model.jsx");
const Users = require("./model/user.model.jsx");
const Address = require("./model/address.model.jsx");

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
    // console.log(product);
    return product;
  } catch (error) {
    throw error;
  }
}

app.get("/api/products/category/:CategoryId", async (req, res) => {
  try {
    const product = await getAllProductDataByCategory(req.params.CategoryId);
    // console.log(product);
    if (product) {
      return res.status(200).json({ data: product });
    }
    res.status(404).json({ error: "This product Id not found" });
    console.error(error.message);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product Data" });
  }
});

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

async function getAllProductDataByCategory(categoryId) {
  try {
    // console.log(categoryId)
    const products = await Products.find({ categoryField: categoryId });
    // console.log(products)
    return products;
  } catch (error) {
    throw error;
  }
}

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
    const category = await Category.findById(categoryId);
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

// * ----------------------- User Profile --------------------------

// ! api for added user Profile

async function createNewUserDetails(newUser) {
  try {
    const user = new Users(newUser);
    const savedUser = user.save();
    return savedUser;
  } catch (error) {
    throw error;
  }
}

app.post("/api/user", async (req, res) => {
  try {
    const user = await createNewUserDetails(req.body);
    if (user) {
      res.status(200).json({ data: user });
    }
    res.status(404).json({ error: "Something wrong in user Details " });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user Detail" });
  }
});

// ! api for get the user Data

async function getUserDetail() {
  try {
    const user = await Users.find();
    return user;
  } catch (error) {
    throw error;
  }
}

app.get("/api/user", async (req, res) => {
  try {
    const user = await getUserDetail();
    if (user) {
      res.status(201).json({ message: "User Detail this:", data: user });
    }
    res.status(404).json({ error: "This User Id not found in Db" });
  } catch (error) {
    throw error;
  }
});

// * ----------------------- User Address --------------------------

// ! create change for user Address

async function createUserAddress(newAddress) {
  try {
    const address = new Address(newAddress);
    const savedAddress = await address.save();
    return savedAddress;
  } catch (error) {
    throw error;
  }
}

app.post("/api/address", async (req, res) => {
  try {
    const address = await createUserAddress(req.body);
    if (address) {
      res.status(200).json({ data: address });
    }
    res.status(404).json({ error: "Something wrong in address Details " });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch address Detail" });
    console.error(error.message);
  }
});

// ! get All User Address

async function getAllDetailOfUserAddress() {
  try {
    const user = await Address.find();
    return user;
  } catch (error) {
    throw error;
  }
}

app.get("/api/address", async (req, res) => {
  try {
    const address = await getAllDetailOfUserAddress()
    if (!address) {
      return res.status(404).json({ error: "Not found" });
    }
    res.status(200).json({ data: address });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch address Detail" });
  }
});

// ! update the User Address Detail

async function updatedToUserAddressDetail(addressId, dataToUpdate){
  try {
    const address = await Address.findByIdAndUpdate(addressId, dataToUpdate, {new: true})
    return address
  } catch (error) {
    throw error
  }
}

app.post('/api/address/:addressId', async (req,res) => {
  try {
    const address = await updatedToUserAddressDetail(req.params.addressId, req.body)
    if(address){
      res.status(201).json({data: address})
    }
    res.status(404).json({error: 'That Address Id not found'})
    console.error(error.message)
  } catch (error) {
    res.status(500).json({error: 'Failed to Fetch address data'})    
  }
})

// ! delete route using address id

async function deletedUserDetailAddress(addressId){
  try {
    const address = await Address.findByIdAndDelete(addressId)
    return address
  } catch (error) {
    throw error
  }
}

app.delete('/api/address/:addressId', async (req,res) => {
  try {
    const address = await deletedUserDetailAddress(req.params.addressId)
    console.log(req.params.addressId)
    if(address){
      res.status(201).json({data: 'User Address Deleted successfully'})
    }
    res.status(404).json({error: 'User Address id not found'})
  } catch (error) {
    res.status(500).json({error: 'Failed to fetch User Address Details'})
  }
})

const PORT = 3001;
app.listen(PORT, () => {
  console.log("Server is running on this", PORT);
});
