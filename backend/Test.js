var chai = require("chai");
const expect = chai.expect;
const myLib = require("./compress");


describe("Compress Test with Chai", () => {
  it("should return number", async() => {
    // const input = "570note";
    const p = await myLib.Compress("599",1,100)
    expect(p).to.equals(0);
  });
});

describe("compress Test with Chai", () => {
  it("should return number", async() => {
    // const input = "570note";
    const p = await myLib.getFileSize(512000)
    expect(p).to.equals("500.00KB");
  });
});
