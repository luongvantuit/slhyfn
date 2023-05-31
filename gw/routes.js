const { Router } = require("express");
const {
  vMiddleware,
  addProductTypeSchema,
  requestProductRegistrationSchema,
  registerBatchSchema,
  addRoleSetSchema,
} = require("./validate");
const { GetCC } = require("./fabricNetwork");
const {} = require("@hyperledger/fabric-gateway");
const {
  ProductModel,
  ProductTypeModel,
  RoleSetModel,
  BatchModel,
} = require("./model");

const route = Router();

/// resgist
route.post(
  "/product-types",
  vMiddleware(addProductTypeSchema),
  async (req, res) => {
    const cc = await GetCC();
    try {
      const r = await cc.submitTransaction(
        "AddProductType",
        req.body.id,
        req.body.productTypeName,
        req.body.type,
        JSON.stringify(req.body.productTypeIngredientNames)
      );
      const rJSON = JSON.parse(Buffer.from(r).toString());
      const productType = new ProductTypeModel({
        name: req.body.productTypeName,
        type: req.body.type,
        productTypeIngredientNames: req.body.productTypeIngredientNames,
        issuerOrgId: rJSON?.issuerOrgId,
        id: req.body.id,
        state: rJSON?.state,
        currentBlockerOrgId: rJSON?.currentBlockerOrgId,
      });
      await productType.save();
      res.send({
        ok: true,
        productType: rJSON,
      });
    } catch (error) {
      res.statusCode = 400;
      res.send({ ok: false, details: error?.details });
    }
  }
);

/// resgist
route.post(
  "/products",
  vMiddleware(requestProductRegistrationSchema),
  async (req, res) => {
    const cc = await GetCC();
    try {
      const { productTypeId, productId, productName } = req.body;
      const r = await cc.submitTransaction(
        "RequestProductRegistration",
        productTypeId,
        productId,
        productName
      );
      const rJSON = JSON.parse(Buffer.from(r).toString());
      const product = new ProductModel({
        name: productName,
        id: productId,
        productTypeId: productTypeId,
        issuerOrgId: rJSON?.issuerOrgId,
        state: rJSON?.state,
        currentBlockerOrgId: rJSON?.currentBlockerOrgId,
        approverOrgId: rJSON?.approverOrgId,
        refuserOrgId: rJSON?.refuserOrgId,
      });
      await product.save();
      res.send({
        ok: true,
        product: rJSON,
      });
    } catch (error) {
      res.statusCode = 400;
      res.send({ ok: false, details: error?.details });
    }
  }
);

/// register batch
route.post("/batchs", vMiddleware(registerBatchSchema), async (req, res) => {
  const cc = await GetCC();

  try {
    const r = await cc.submitTransaction(
      "RegisterBatch",
      req.body.id,
      req.body.productId,
      JSON.stringify(req.body.batchIngredientIds),
      JSON.stringify(req.body.params)
    );
    const rJSON = JSON.parse(Buffer.from(r).toString());
    const roleSet = new BatchModel({
      ...rJSON,
      id: req.body.id,
    });
    await roleSet.save();
    res.send({
      ok: true,
      batch: rJSON,
    });
  } catch (error) {
    res.statusCode = 400;
    res.send({ ok: false, details: error?.details });
  }
});

/// add role set
route.post("/role-set", vMiddleware(addRoleSetSchema), async (req, res) => {
  const cc = await GetCC();
  try {
    await cc.submitTransaction(
      "AddRoleSet",
      req.body.orgId,
      JSON.stringify(req.body.roles)
    );
    const roleSet = await RoleSetModel.findOneAndUpdate(
      {
        orgId: req.body.orgId,
      },
      {
        orgId: req.body.orgId,
        roles: req.body.roles,
      },
      {
        upsert: true,
      }
    );
    await roleSet.save();
    res.send({
      ok: true,
    });
  } catch (error) {
    res.statusCode = 400;
    res.send({ ok: false, details: error?.details });
  }
});

route.get("/role-set", async (req, res) => {
  const cc = await GetCC();
  try {
    const r = await cc.evaluateTransaction("GetRoleSetCurrent");
    const rJSON = JSON.parse(Buffer.from(r).toString());
    res.send({
      ok: true,
      batch: rJSON,
    });
  } catch (error) {
    res.statusCode = 400;
    res.send({ ok: false, details: error?.details });
  }
});

route.get("/products", async (req, res) => {
  const products = await ProductModel.find();
  res.send({
    ok: true,
    products,
  });
});

route.get("/product-types", async (req, res) => {
  const productTypes = await ProductTypeModel.find();
  res.send({
    ok: true,
    productTypes,
  });
});

route.get("/batchs", async (req, res) => {
  const batchs = await BatchModel.find();
  res.send({
    ok: true,
    batchs,
  });
});

module.exports = {
  route,
};
