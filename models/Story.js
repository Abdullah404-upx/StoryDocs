

const moongose = require('mongoose');
const User = require('./User')
const storySchema = new moongose.Schema({

   title: {
       type: String,
       required: true,
       trim: true // trimming white space
   },
   body: {
    type: String,
    required: true
},
status: {
    type: String,
    default: 'public',
    enum: ['public', 'private']
}, 
user: {
    type: moongose.Schema.Types.ObjectId,
    ref: 'User'
}, 
 
createdAt: {
    type: Date,
    default: Date.now
}
})

module.exports = moongose.model('Story', storySchema)