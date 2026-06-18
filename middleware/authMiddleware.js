const jwt = require("jsonwebtoken");
const authMiddleware = (req,res,next)=>{
  try {
    const client_token = req.headers.authorization;
    if (!client_token || !client_token.startsWith("Bearer ")){
        return res.status(401).json({"message":"Token is missing"});
    }
    const token = client_token.split(" ")[1];
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.user = decoded; // make user id available to controllers
    next();
  } catch (error) {
    return res.status(401).json({"message":"Invalid or expired token"});
  }
}
module.exports = authMiddleware;