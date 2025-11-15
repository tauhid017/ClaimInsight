const express = require('express');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const inputSchema = new Schema({
    damage_type: { type: String, required: true },
    img:{type:String, required:true},
});
module.exports = mongoose.model('Input', inputSchema);