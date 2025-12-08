const { expect } = require("chai");

describe("Simple Test", () => {
  it("should log hello", () => {
    console.log("HELLO WORLD");
    expect(1).to.equal(1);
  });
});
