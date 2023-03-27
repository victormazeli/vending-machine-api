/* eslint-disable func-names */
import mongoose from 'mongoose'

const { Schema } = mongoose

const ProductSchema = new Schema(
    {
       
        productName: {
            type: String,
            lowercase: true,
            required: true,
        },
        amountAvailable: {
            type: Number,
            required: true,
            default: 0,
        },
        cost: {
            type: Number,
            required: true,
            min: 5,
        },
        sellerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        deletedAt: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
)


const Product = mongoose.model('Product', ProductSchema)

export default Product