const Mobile = require("../models/Mobile");
exports.getAllMobiles = async (req,res)=>{
    try{
        const mobiles = await Mobile.find();
        res.status(200).json(mobiles);
    }catch(err){
        res.status(500).json({"message":"Internal Server Side Error"});
    }
}