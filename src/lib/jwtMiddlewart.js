import jwt from 'jsonwebtoken';
import User from '../models/user';

const jwtMiddleware = async (ctx, next) => {
    const token = ctx.cookies.get('access_token');
    //토큰이 없으면 다음 작업 진행
    if(!token){
        return next();
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        ctx.state.user = {
            _id: decoded._id,
            profile: decoded.profile,
        }

        //토큰의 남은 유효기간이 3.5일 미만이면, 토큰 재발급
        const now = Math.floor(Date.now() / 1000);
        if(decoded.exp - now < 60 * 60 * 24 * 3.5){
            const user = await User.findById(decoded._id);
            const token = user.generateToken();
            ctx.cookies.set('access_token', token, {
                maxAge: 100 * 60 * 60 * 24 * 7,
                httpOnly: true,
            })
        }
        return next();
    } catch(e){
        return next();
    }
}

export default jwtMiddleware;