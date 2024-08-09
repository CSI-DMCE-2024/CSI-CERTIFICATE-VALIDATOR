const { Schema, connection } = require("mongoose");

const CertificateSchema = new Schema(
  {
    event_id: {
      type: Schema.Types.ObjectId,
      required: [true, "event id is required"],
    },
    uid: {
      type: String,
      required: [true, "uid is required"],
      unique: true,
    },
    name: {
      type: String,
      trim: true,
      required: [true, "name is required"],
      match: [/^[a-zA-Z ]+$/, (props) => `${props.value} is not a valid name`],
      lowercase: true,
    },
    position: {
      type: Number,
      required: [true, "position is required"],
      trim: true,
      enum: [0, 1, 2, 3],
    },
    date: {
      type: Date,
      required: [true, "date is required"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = connection
  .useDb("certificate-validator")
  .model("Certificate", CertificateSchema);
