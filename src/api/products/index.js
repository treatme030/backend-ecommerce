import Router from 'koa-router';
import * as productsCtrl from './products.ctrl';

const products = new Router;

products.get('/', productsCtrl.list)
products.post('/', productsCtrl.create)
products.patch('/:id', productsCtrl.getProductById, productsCtrl.update)
products.delete('/:id', productsCtrl.getProductById, productsCtrl.remove)
products.get('/:id', productsCtrl.getProductById, productsCtrl.select)

export default products;
