import User from '../../models/user';
import Joi from 'joi';

//회원가입
//POST --> /api/auth/register
export const register = async ctx => {
    //데이터 검증
    const schema = Joi.object().keys({
        username: Joi.string().alphanum().min(4).max(15).required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    })
    const result = schema.validate(ctx.request.body);
    //스키마 검증 실패
    if(result.error){
        ctx.status = 400;
        return;
    }

    const { username, email, password } = ctx.request.body;
    try {
        //아이디, 이메일 중복 확인
        const exists = await User.findByEmailOrUsername(username, email);
        if(exists){
            ctx.status = 409; //conflict
            //어떤 값이 중복되는지 알려줌
            ctx.body = {
                key: exists.email === email ? 'email' : 'username'
            }
            return;
        }
        //계정 생성 
        const user = new User({
            profile:{ username },
            email,
        })
        await user.setPassword(password);
        await user.save();
        ctx.body = user.serialize(); //password 제거하고 응답 보내기

        //토큰 생성
        const token = user.generateToken();
        //쿠키 설정
        ctx.cookies.set('access_token', token, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
        })
    } catch(e){
        ctx.throw(500, e);
    }
}

//이메일 로그인
//POST --> /api/auth/login
export const login = async ctx => {
    //데이터 검증
    const schema = Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    })
    const result = schema.validate(ctx.request.body);
    //검증 실패시 
    if(result.error){
        ctx.status = 400;
        return;
    }
    const { email, password } = ctx.request.body;
    try {
        const user = await User.findByEmail(email);
        //유저가 존재하지 않으면, 
        if(!user){
            ctx.status = 401;
            return;
        }
        //비밀번호가 일치하지 않으면,
        const valid = await user.checkPassword(password);
        if(!valid){
            ctx.status = 401;
            return;
        }
        ctx.body = user.serialize();
        //토큰 생성
        const token = user.generateToken();
        //쿠키 설정
        ctx.cookies.set('access_token', token, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
        })
    } catch(e){
        ctx.throw(500, e);
    }
}

//로그인 상태 확인
export const check = async ctx => {}

//로그아웃
//POST --> /api/auth/logout
export const logout = async ctx => {
    //access_token 값을 넣어주지 않으면 됨
    ctx.cookies.set('access_token');
    ctx.status = 204;
}
