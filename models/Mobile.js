const moongoose = require('mongoose');
const mobileSchema = new moongoose.Schema({
    pid: {type:Number,required:true},
    pname : {type:String,required:true},
    pcost : {type:Number,required:true},
    pqty : {type:Number,required:true},
    pimage : {type:String,required:true},
});
module.exports = moongoose.model("Mobile",mobileSchema);