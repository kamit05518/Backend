const bcrypt = require("bcrypt");
const saltRounds = 10;

//  Hash password
const hashPassword = async (plainPassword) => {
  const hashed = await bcrypt.hash(plainPassword, saltRounds);
  return hashed;
};

// Compare password
const comparePassword = async (plainPassword, hashedPassword) => {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatch;
};

module.exports = {
  hashPassword,
  comparePassword,
};
