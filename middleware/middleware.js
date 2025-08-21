import jwt from 'jsonwebtoken';

const middleware = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) return res.redirect('/login');
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = verified;
        next();
    } catch (err) {
        return res.redirect('/login');
    }
};

export const adminMiddleware = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) return res.redirect('/admin/login');
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (verified.data.type !== "admin") {
            return res.redirect('/admin/login');
        }
        req.user = verified;
        next();
    } catch (err) {
        return res.redirect('/admin/login');
    }
};

export default middleware;
