const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {

  const token = req.header('Authorization')?.split(' ')[1]; 
  console.log("🟢 Middleware running...")
  console.log("🔹 JWT Secret Key:", process.env.JWT_SECRET || "NOT SET")
console.log("token verify ",token);

  if (!token) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decode",decoded);
    
    req.user = decoded;  
    next();  
  } catch (error) {
    console.log("err",error)
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticateJWT;