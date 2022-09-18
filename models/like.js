const mongoose = require('mongoose');
const likeSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required : true
    },

    likable:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath : 'onModel'
    },

    onModel:{
        type:String,
        required:true,
        enum :['Post','Comment']
    }
},
{
    timestamps:true
});

let Like = mongoose.model('Like', likeSchema);
module.exports = Like;