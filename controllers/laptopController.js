const Laptop = require("../models/Laptop");
const createProductController = require('./createProductController');
const controller = createProductController(Laptop, 'Laptop');
exports.getAllLaptops = controller.getAll;