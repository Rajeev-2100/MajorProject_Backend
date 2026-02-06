const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
});

const Address = mongoose.model("Address", AddressSchema);
module.exports = Address;
