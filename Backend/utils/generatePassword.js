// utils/generatePassword.js
import crypto from "crypto";
export const generatePassword = (length = 10) => {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // no I/O to avoid confusion
  const lower = "abcdefghijkmnpqrstuvwxyz";
  const digits = "23456789"; // no 0/1 to avoid confusion
  const symbols = "!@#$%";

  const all = upper + lower + digits + symbols;

  const pick = (charset) =>
    charset[crypto.randomInt(0, charset.length)];

  // Guarantee at least one of each character class
  let password = [pick(upper), pick(lower), pick(digits), pick(symbols)];

  for (let i = password.length; i < length; i++) {
    password.push(pick(all));
  }

  // Shuffle so the guaranteed chars aren't always in the same position
  for (let i = password.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1);
    [password[i], password[j]] = [password[j], password[i]];
  }

  return password.join("");
};