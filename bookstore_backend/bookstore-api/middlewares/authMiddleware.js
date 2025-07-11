const jwt = require('jsonwebtoken');

// Xác thực người dùng bằng JWT
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  // Kiểm tra xem header Authorization có tồn tại không
  if (!authHeader) {
    return res.status(401).json({ 
      success: false,
      error: 'Authorization header is missing' 
    });
  }
  
  // Kiểm tra định dạng header (Bearer token)
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ 
      success: false,
      error: 'Invalid token format. Use: Bearer <token>' 
    });
  }
  
  const token = parts[1];
  
  try {
    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Lưu thông tin user vào request
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    
    // Phân loại lỗi chi tiết hơn
    let errorMessage = 'Invalid token';
    if (err.name === 'TokenExpiredError') {
      errorMessage = 'Token expired';
    } else if (err.name === 'JsonWebTokenError') {
      errorMessage = 'Malformed token';
    }
    
    return res.status(401).json({ 
      success: false,
      error: errorMessage 
    });
  }
};

// Phân quyền chỉ cho admin
const authorizeAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false,
      error: 'User not authenticated' 
    });
  }
  
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
  if (!req.user) {
    return res.status(401).json({ 
      success: false,
      error: 'User not authenticated' 
    });
  }
  
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