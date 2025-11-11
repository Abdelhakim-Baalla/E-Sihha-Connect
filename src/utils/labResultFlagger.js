const toPlainObject = (doc) => {
  if (!doc) return doc;
  if (typeof doc.toObject === "function") {
    return doc.toObject({ depopulate: false });
  }
  if (typeof doc.toJSON === "function") {
    return doc.toJSON();
  }
  return JSON.parse(JSON.stringify(doc));
};

const isNumber = (value) => typeof value === "number" && !Number.isNaN(value);

const computeLabTestFlag = (test = {}) => {
  const { resultatValeur, referenceMin, referenceMax } = test;
  if (!isNumber(resultatValeur)) return "unknown";

  const hasMin = isNumber(referenceMin);
  const hasMax = isNumber(referenceMax);

  if (hasMin && resultatValeur < referenceMin) return "low";
  if (hasMax && resultatValeur > referenceMax) return "high";
  if (!hasMin && !hasMax) return "unknown";
  return "normal";
};

const decorateOrderWithFlags = (order) => {
  if (!order) return order;
  const plainOrder = toPlainObject(order);
  const tests = Array.isArray(plainOrder.tests) ? plainOrder.tests : [];

  return {
    ...plainOrder,
    tests: tests.map((test) => ({
      ...test,
      flag: computeLabTestFlag(test),
    })),
  };
};

const decorateOrdersWithFlags = (orders = []) => {
  if (!Array.isArray(orders)) {
    return decorateOrderWithFlags(orders);
  }
  return orders.map((order) => decorateOrderWithFlags(order));
};

module.exports = {
  computeLabTestFlag,
  decorateOrderWithFlags,
  decorateOrdersWithFlags,
};
