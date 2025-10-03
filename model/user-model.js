//new user model vai auto generated pass

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    photo: { type: String, default: "" },
    password: { type: String, required: true }, // will be hashed
    role: {
      type: String,
      enum: ["admin", "vendor", "company"],
      required: true,
    },

    profile: {
      address: String,
      phone: String,
      website: String,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // only hash if changed
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("User", UserSchema);
