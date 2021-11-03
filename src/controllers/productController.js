import Product from "../models/product";


//create product
export const createProduct = async (req, res, next) => {
    const product = await Product.create(req.body);
    res.status(201).json({
        sucess: true, 
        product,
    })
}

//get all products
export const getAllProducts = async (req, res) => {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        products,
    })
}

//get product details
export const getProductDetails = async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if(!product){
        return res.status(500).json({
            success: false,
            message: "Product not found",
        })
    }
    res.status(200).json({
        success: true,
        product,
    })
}

//update product 
export const updateProduct = async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if(!product){
        return res.status(500).json({
            success: false,
            message: "Product not found",
        })
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })
    res.status(200).json({
        success: true,
        product,
    })
}

//delete product
export const deleteProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if(!product){
        return res.status(500).json({
            success: false,
            message: "Product not found",
        })
    }
    await product.remove();
    res.status(200).json({
        success: true,
        message: "Product delete successfully",
    })
}