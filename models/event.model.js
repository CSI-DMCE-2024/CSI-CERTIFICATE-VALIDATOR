const { Schema, connection } = require("mongoose");

const EventSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name is required"],
    },
    year: {
      type: Number,
      min: 2000,
      required: [true, "year is required"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = connection
  .useDb("certificate-validator")
  .model("Event", EventSchema);
