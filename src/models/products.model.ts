import mongoose, { Types } from "mongoose";

export interface Product {
    name: string;
    description: string;
    images: string[];
    price: number;
    qty: number;
    categoryId: Types.ObjectId;
    createdAt: string;
    updatedAt: string;
    _id?: Types.ObjectId;
}

const Schema = mongoose.Schema;

const ProductsSchema = new Schema<Product>(
    {
        name: {
            type: Schema.Types.String,
            required: true,
        },
        description: {
            type: Schema.Types.String,
            required: true,
        },
        images: {
            type: [Schema.Types.String],
            required: true,
        },
        price: {
            type: Schema.Types.Number,
            required: true,
        },
        qty: {
            type: Schema.Types.Number,
            required: true,
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: "Category",
        },

    },
    {
        timestamps: true,
    }
)

const ProductsModel = mongoose.model("Product", ProductsSchema);

export default ProductsModel;