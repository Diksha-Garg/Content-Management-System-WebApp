const mongoose = require("mongoose");

//const URLSlugs = require('mongoose-url-slugs');
const Schema = mongoose.Schema;
const CategorySchema = new Schema({
  name: {
    type: String,
    required: true
  }
});

//PostSchema.plugin(URLSlugs('title', {field: 'slug'}));

module.exports = mongoose.model("categories", CategorySchema);
