const app = require("../src/app");
const mongoose = require("mongoose");

exports.mochaHooks = {
  beforeAll: [
    async function () {
      this.timeout(20000);
      if (app.ready) {
        await app.ready;
      }
    },
  ],
  afterAll: [
    async function () {
      this.timeout(10000);
      if (app.close) {
        await app.close();
      }

      if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
      }
    },
  ],
};
