import crypto from "crypto";

export default function cryptoHash(...inputs) {
  const input = inputs.sort().join(" ");

  const hash = crypto.createHash("sha256");
  hash.update(input);
  return hash.digest("hex");
}
