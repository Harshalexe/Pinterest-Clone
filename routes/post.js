const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the post schema
const postSchema = new Schema({
  postText: {
    type: String,
    required: true,
    trim: true
  },
  image:{
    type:String
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  currentDateAndTime: {
    type: Date,
    default: Date.now
  },
  likes: [{
    type: Array,
    ref: 'User'
  }]
});

// Create the Post model based on the schema
module.exports = mongoose.model('Post', postSchema);


