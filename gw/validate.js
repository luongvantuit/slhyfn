const yup = require("yup");

const addProductTypeSchema = yup.object({
  id: yup.string().required(),
  productTypeName: yup.string().required(),
  type: yup.string().oneOf(["primary", "derived"]).required(),
  productTypeIngredientNames: yup.array(),
});

const requestProductRegistrationSchema = yup.object({
  productTypeId: yup.string().required(),
  productId: yup.string().required(),
  productName: yup.string().required(),
});

const registerBatchSchema = yup.object({
  id: yup.string().required(),
  productId: yup.string().required(),
  batchIngredientIds: yup.array(),
  params: yup.array(),
});

const addRoleSetSchema = yup.object({
  orgId: yup.string().required(),
  roles: yup.array(yup.string()).required(),
});

/**
 * Note
 */
const addProductSchema = yup.object({
  id: yup.string(),
  name: yup.string(),
  type: yup.string().oneOf(["primary", "derived"]).required(),
  dependencies: yup.array(),
});

/**
 *
 * @param {*} schema
 * @returns
 */
const addHistorySchema = yup.object({
  id: yup.string(),
  note: yup.string(),
  date: yup.date().required(),
});

function vMiddleware(schema) {
  return async (req, res, next) => {
    try {
      await schema.validate(req.body);
      next();
    } catch (error) {
      res.statusCode = 400;
      res.send({
        ok: false,
        error: error,
      });
    }
  };
}

module.exports = {
  vMiddleware,
  addProductTypeSchema,
  requestProductRegistrationSchema,
  registerBatchSchema,
  addRoleSetSchema,
  addProductSchema,
  addHistorySchema,
};
