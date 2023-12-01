const { model, Schema } = require('mongoose');

const chatSchema = new Schema({
    name: String,
    message: String,
}, {
    versionKey: false,
    timestamps: true,
    
});


module.exports = model( 'chat', chatSchema );