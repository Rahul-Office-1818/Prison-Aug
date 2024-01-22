import jwt from 'jsonwebtoken';

const middleware = (req, res, next) => {
    const token = req.cookies?.token;
    if(!token) return res.redirect('/login');
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if(!verified) return res.redirect('/login');
    req.user = verified;
    next();
}


export default middleware;