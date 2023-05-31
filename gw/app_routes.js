const { Router } = require("express");
const {
  vMiddleware,
  addProductSchema,
  addHistorySchema,
} = require("./validate");
const { GetCC } = require("./fabricNetwork");
const {} = require("@hyperledger/fabric-gateway");
const randomstring = require("randomstring");

const route = Router();

/// Add Product
route.post("/products", vMiddleware(addProductSchema), async (req, res) => {
  const cc = await GetCC();
  try {
    let { id, name, type, dependencies } = req.body;
    if (!id) {
      id = randomstring.generate();
    }
    const r = await cc.submitTransaction(
      "AddProduct",
      id,
      name,
      type,
      JSON.stringify(dependencies),
      new Date().toISOString()
    );
    const rJSON = JSON.parse(Buffer.from(r).toString());

    res.send({
      ok: true,
      product: rJSON,
    });
  } catch (error) {
    res.statusCode = 400;
    res.send({ ok: false, details: error?.details });
  }
});

/// Get Product
route.get("/products/:id", async (req, res) => {
  const cc = await GetCC();
  try {
    const r = await cc.evaluateTransaction("GetProduct", req.params.id);
    const rJSON = JSON.parse(Buffer.from(r).toString());
    res.send({
      ok: true,
      product: rJSON,
    });
  } catch (error) {
    res.statusCode = 400;
    res.send({ ok: false, details: error?.details });
  }
});

/// Get Products
route.get("/products", async (req, res) => {
  const cc = await GetCC();
  try {
    const r = await cc.evaluateTransaction("GetProducts");
    const rJSON = JSON.parse(Buffer.from(r).toString());
    res.send({
      ok: true,
      products: rJSON,
    });
  } catch (error) {
    res.statusCode = 400;
    res.send({ ok: false, details: error?.details });
  }
});

/// Add History
route.post("/histories", vMiddleware(addHistorySchema), async (req, res) => {
  const cc = await GetCC();
  try {
    const r = await cc.submitTransaction(
      "AddHistory",
      req.body.id,
      req.body.note,
      req.body.date
    );
    const rJSON = JSON.parse(Buffer.from(r).toString());
    res.send({
      ok: true,
      product: rJSON,
    });
  } catch (error) {
    res.statusCode = 400;
    res.send({ ok: false, details: error?.details });
  }
});
/// My Product
route.post("/myproduct", async (req, res) => {
  const cc = await GetCC();
  try {
    const r = await cc.submitTransaction("MyProduct");
    const rJSON = JSON.parse(Buffer.from(r).toString());
    res.send({
      ok: true,
      products: rJSON,
    });
  } catch (error) {
    res.statusCode = 400;
    res.send({ ok: false, details: error?.details });
  }
});

/// My Product
route.post("/mymsp", async (req, res) => {
  const cc = await GetCC();
  try {
    const r = await cc.submitTransaction("MyMSP");
    res.send({
      ok: true,
      msp: Buffer.from(r).toString(),
    });
  } catch (error) {
    res.statusCode = 400;
    res.send({ ok: false, details: error?.details });
  }
});

module.exports = {
  route,
};
