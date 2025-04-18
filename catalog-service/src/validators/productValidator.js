const Ajv = require("ajv");
const ajv = new Ajv();

const productSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    description: { type: "string" },
    price: { type: "number" },
    category: { type: "string" }
  },
  required: ["id", "name", "description", "price", "category"],
  additionalProperties: false
};

const validate = ajv.compile(productSchema);
module.exports = validate;
