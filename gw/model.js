const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const ProductTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ["primary", "derived"] },
  productTypeIngredientNames: [String],
  issuerOrgId: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  state: String,
  currentBlockerOrgId: String,
});

const ProductTypeModel = mongoose.model("ProductType", ProductTypeSchema);

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  productTypeId: String,
  issuerOrgId: {
    type: String,
    required: true,
  },
  state: String,
  currentBlockerOrgId: String,
  approverOrgId: String,
  refuserOrgId: String,
});

const ProductModel = mongoose.model("Product", ProductSchema);

const RoleSetSchema = new mongoose.Schema({
  orgId: {
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    required: true,
  },
});

const RoleSetModel = mongoose.model("RoleSet", RoleSetSchema);

const BatchSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },

  batchIngredientIds: {
    type: [String],
  },
  params: {
    type: [String],
  },
  state: {
    type: String,
    required: true,
  },
  currentOwnerOrgId: {
    type: String,
    required: true,
  },
  currentBlockerOrgId: {
    type: String,
  },
  currentReceiverOrgId: {
    type: String,
  },
  outputBatchId: {
    type: String,
  },
});

const BatchModel = mongoose.model("batch", BatchSchema);

module.exports = {
  ProductTypeModel,
  ProductModel,
  RoleSetModel,
  BatchModel,
};
