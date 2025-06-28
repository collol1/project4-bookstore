const jwt = require('jsonwebtoken');

// Xác thực người dùng bằng JWT
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: 'Unauthorized: No token provided' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ 
      success: false,
      error: 'Unauthorized: Invalid token' 
    });
  }
};

// Phân quyền chỉ cho admin
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false,
      error: 'Forbidden: Admin access required' 
    });
  }
  next();
};

// Kiểm tra quyền sở hữu hoặc admin
const authorizeOwnershipOrAdmin = (resourceUserId) => (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.id !== resourceUserId) {
    return res.status(403).json({ 
      success: false,
      error: 'Forbidden: You do not have permission' 
    });
  }
  next();
};

module.exports = {
  authenticate,
  authorizeAdmin,
  authorizeOwnershipOrAdmin
};
