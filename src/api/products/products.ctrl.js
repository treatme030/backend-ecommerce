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
//GET --> /api/products?keyword=&category=&page=
export const list = async ctx => {
    //query는 문자열로 숫자로 변환, 값이 주어지지 않았다면 1을 기본으로 사용
    const page = parseInt(ctx.query.page || '1')
    if(page < 1){
        ctx.status = 400;
        return;
    }

    const { keyword, category } = ctx.query;
    //keyword 값이 유효하면 객체 안에 넣고, 그렇지 않으면 넣지 않음
    const query = {
        ...( keyword ? { name: keyword } : {}),
        ...( category ? { category: category } : {}),
    }
    console.log(query)
    try {
        //quer 값에 따른 상품 불러오기
        const products = await Product.find(query)
        .sort({ _id: -1 }) //내림차순으로 정렬
        .limit(10)//보이는 개수 제한 
        .skip((page - 1) * 10) //해당 개수를 제외하고 그 다음 데이터를 불러옴
        .exec();//find() 함수를 호출한 후에 exec()를 붙여 주어야 서버에 쿼리를 요청함
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