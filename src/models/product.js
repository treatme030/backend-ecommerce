import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema({
    name: String,
    description: String,
    price: Number,
    rating: {
        type: Number,
        default: 0,
    },
    images: [
        {
            public_id: String,
            url: String,
        }
    ],
    category:String,
    stock: {
        type: Number,
        default: 1,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            name:String,
            rating: Number,
            comment:String
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

const Product = mongoose.model('Product', ProductSchema);
export default Product;