const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');
//Create new schema for a subdocument
// we'll need a unique identifier instead of the default _id field that is created, so we'll add a custom replyId field.
//we're still going to have it generate the same type of ObjectId() value that the _id field typically does, but we'll have to import that type of data first.
const ReplySchema = new Schema(
  {

     // set custom id to avoid confusion with parent comment _id
     replyId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId()
    },
    replyBody: {
      type: String,
      required: true,
      trim: true
    },
    writtenBy: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => dateFormat(createdAtVal)
    }
  },
  {
    toJSON: {
      getters: true,
    }
  }
);

//Now let's associate replies with comments. Update the CommentSchema to have the replies field populated with an array of data that adheres to the ReplySchema definition. The replies field in CommentSchema should look like the following code:
// replies will be nested directly in a comment's document and not referred to.
const CommentSchema = new Schema({
  writtenBy: {
    type: String,
    required: true,
      trim: true
  },
  commentBody: {
    type: String,
    required: true,
      trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: createdAtVal => dateFormat(createdAtVal)
  },
  replies : [ReplySchema]
},
{
  toJSON: {
    virtuals: true,
    getters: true
  },
  id: false
}
);

CommentSchema.virtual('replyCount').get(function() {
  return this.replies.length;
});

const Comment = model('Comment', CommentSchema);

module.exports = Comment;