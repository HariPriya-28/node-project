const jwt = require("jsonwebtoken");
const authMiddleware = (req,res,next)=>{
  try {
    const client_token = req.headers.authorization;
    if (!client_token || !client_token.startsWith("Bearer ")){
        return res.status(400).json({"message":"token is missing"});
    }
    const token = client_token.split(" ")[1];
    const flag = jwt.verify(token,process.env.JWT_SECRET);
    if(flag){
        next();
    }else{
        return res.status(400).json({"message":"Invalid token"});
    }
  } catch (error) {
    res.status(401).json({"message":"Server Side Error"});
  }
}
module.exports = authMiddleware;