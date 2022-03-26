import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
  try {
    const token =
      req.headers['authorization'] &&
      req.headers['authorization'].split(' ')[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.DB_TOKEN);
      req.user = decoded.user;
      next();
      return;
    }
    res.status(401).json({
      success: false,
      message: 'Bạn có thể đăng nhập',
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token is incorrect',
    });
  }
};

export const middleAdmin = async (req, res, next) => {
  try {
    const { user } = req;
    if (user.role !== 'admin') {
      return res.status(401).json({
        message: 'not permission',
      });
    }
    next();
  } catch (error) {}
};

export const middleAdminBlock = async (req, res, next) => {
  try {
    const { userName } = req.user;
    if (userName === 'admin') {
      return res.status(401).json({
        message: 'Tạm thời chặn tài khoản admin này',
        success: true,
      });
    }
    next();
  } catch (error) {}
};
