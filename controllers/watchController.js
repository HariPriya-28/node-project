const Watch = require("../models/Watch");
const createProductController = require('./createProductController');
const controller = createProductController(Watch, 'Watch');
exports.getAllWatches = controller.getAll;