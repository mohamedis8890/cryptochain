import Block from "./block";

describe("Block", () => {
  const data = ["blockchain", "data"];
  const hash = "foo-hash";
  const lastHash = "foo-lastHash";
  const timeStamp = "foo-timestamp";
  const block = new Block({ data, hash, lastHash, timeStamp });

  it("should have data, hash, lastHash, timestamp property", () => {
    expect(block.data).toEqual(data);
    expect(block.timeStamp).toEqual(timeStamp);
    expect(hash).toEqual(hash);
    expect(lastHash).toEqual(lastHash);
  });
});
