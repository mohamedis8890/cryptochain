import cryptoHash from "./crypto-hash";

describe("cryptoHash()", () => {
  const sha =
    "2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae";

  it("generates a sha256-hashed output", () => {
    expect(cryptoHash("foo")).toEqual(sha);
  });

  it("produces the same hash given the same input arguments an any order", () => {
    expect(cryptoHash("one", "two", "three")).toEqual(
      cryptoHash("three", "two", "one")
    );
  });
});
