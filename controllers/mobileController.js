const Mobile = require("../models/Mobile");
const createProductController = require('./createProductController');
const controller = createProductController(Mobile, 'Mobile');
exports.getAllMobiles = controller.getAll;