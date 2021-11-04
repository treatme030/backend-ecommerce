import Router from 'koa-router';
import * as productsCtrl from './products.ctrl';

const products = new Router;

const printInfo = ctx => {
    ctx.body = {
        method: ctx.method,
        path: ctx.path,
        params: ctx.params,
    }
}

products.get('/', productsCtrl.items)
products.post('/', productsCtrl.create)
products.patch('/:id', productsCtrl.update)
products.delete('/:id', productsCtrl.remove)
products.get('/:id', productsCtrl.select)

export default products;
