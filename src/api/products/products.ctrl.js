import mongoose from 'mongoose';
import Product from '../../models/product';

const { ObjectId } = mongoose.Types;

//클라이언트가 요청을 잘못 보낸건지 ObjectId 확인
export const getProductById = async (ctx, next) => {
    const { id } = ctx.params;
    if (!ObjectId.isValid(id)) {
        ctx.status = 400;//bad request
        return;
    }
    try {
        const product = await Product.findById(id);
        if (!product) {
            ctx.status = 404;
            return;
        }
        ctx.state.product = product;
        return next();
    } catch (e) {
        ctx.throw(500, e);
    }
}

//모든 상품 불러오기
//GET --> /api/products
export const list = async ctx => {
    try {
        //find() 함수를 호출한 후에 exec()를 붙여 주어야 서버에 쿼리를 요청함
        const products = await Product.find().exec();
        ctx.body = products;
    } catch(e){
        ctx.throw(500, e);
    }
}

//상품 등록하기
//POST --> /api/products
export const create = async ctx => {
    console.log(ctx.request.body)
    const { name, description, price, images, category, stock, reviews } = ctx.request.body;
    const product = new Product({//모델 객체를 생성하고, 요청 받은 값 넣어주기
        name,
        description,
        price,
        images,
        category,
        stock,
        reviews,
    })
    try {  
        await product.save();//데이터베이스에 저장
        ctx.body = product;     
    } catch(e){
        console.log(e)
        ctx.throw(500, e);
    }
}

//상품 변경하기
//PATCH --> api/products/:id
export const update = async ctx => {
    const { id } = ctx.params;
    try {
        const product = await Product.findByIdAndUpdate(id, ctx.request.body, {
            new: true, //true:업데이트된 데이터 반환, false:업데이트되기 전 데이터 반환 
        }).exec();
        if(!product){
            ctx.status = 404;
            return;
        }
        ctx.body = product;
    } catch(e){
        ctx.throw(500, e);
    }
}

//상품 삭제하기
//DELETE --> api/products/:id
export const remove = async ctx => {
    const { id } = ctx.params;
    try {
        await Product.findByIdAndRemove(id).exec();
        ctx.status = 204;
    } catch(e){
        ctx.throw(500, e);
    }
}

//특정 상품 보기
//GET --> api/products/:id
export const select = async ctx => {
    ctx.body = ctx.state.product;
}