const mongoose = require('mongoose');

// Factory function to create a product model
module.exports = (modelName) => {
    const productSchema = new mongoose.Schema({
        pid: { type: Number, required: true, unique: true },
        pname: { type: String, required: true },
        pcost: { type: Number, required: true },
        pqty: { type: Number, required: true },
        pimage: { type: String, required: true },
    });
    return mongoose.model(modelName, productSchema);
};
