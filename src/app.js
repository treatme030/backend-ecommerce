require('dotenv').config();
import mongoose from 'mongoose';
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import jwtMiddleware from './lib/jwtMiddlewart';

import api from './api';

const { PORT, MONGO_URI } = process.env;

//서버와 데이터베이스 연결
mongoose
.connect(MONGO_URI)
.then(() => {
    console.log('Connected to MongoDB')
})
.catch(e => {
    console.error(e)
})

const app = new Koa();
const router = new Router();

//api 라우터 설정
router.use('/api', api.routes());

//라우터 적용 전에 bodyParser 적용
app.use(bodyParser());
app.use(jwtMiddleware);

//app 인스턴스에 라우터 적용 
app.use(router.routes()).use(router.allowedMethods());


const port = PORT || 4000;
app.listen(port, () => {
    console.log(`Server is working on http://localhost:${port}`);
})
