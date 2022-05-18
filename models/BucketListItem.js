const { Schema, model } = require("mongoose");

const BucketListItemSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    default: "dong test 1 ti",
  },
});

const BucketListItem = model("bucketListItem", BucketListItemSchema);

module.exports = BucketListItem;
