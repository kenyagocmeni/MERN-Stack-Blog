const redisClient = require("../config/redis");

const chechBlacklist = async (req, res, next)=>{
    const token = req.headers.authorization?.split[1];

    if(!token){
        return res.status(401).json({message: "Yetkisiz erişim"});
    }

    const isBlackListed = await redisClient.get(token);
    if(isBlackListed){
        return res.status(401).json({message: "Token geçersiz"});
    }

    next();
};