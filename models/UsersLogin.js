const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const SALT_WORK_FACTOR = 10;

const UserLoginSchema = new Schema({
  userID: { type: String, required: true },
  userName: { type: String, required: true },
  password: { type: String, required: true },
  description: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    default: "TSV",
  },
  role: { type: String, required: true },
});

UserLoginSchema.pre("save", async function save(next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

// UserLoginSchema.methods.validatePassword = async function validatePassword(data) {
//   return bcrypt.compare(data, this.password);
// };

const UserLoginListItem = model("userLogin", UserLoginSchema);
module.exports = UserLoginListItem;
