import mongoose , {Types} from "mongoose";

const Schema = mongoose.Schema;

export interface IOrderItem {
    name: string;
    productId: Types.ObjectId;
    price: number;
    qty: number
}

export interface Order {
    _id?: Types.ObjectId;
    grandTotal: number;
    orderItems: IOrderItem[];
    createdBy: Types.ObjectId;
    status: 'pending' | 'completed' | 'cancelled';
    createdAt: string;
    updatedAt: string
}

const OrdersSchema = new Schema<Order>(
    {
        grandTotal: { 
            type: Schema.Types.Number, 
            required: true 
        },
        orderItems: [{
            name: {
                type: Schema.Types.String, 
                required: true
            },
            productId: {
                type: Schema.Types.ObjectId, 
                ref: 'Product',required: true
            },
            price: {
                type: Schema.Types.Number,
                required: true
            },
            qty: {
                type: Schema.Types.Number, 
                required: true, 
                min: 1, 
                max: 5}
        }],
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        status: {
            type: Schema.Types.String,
            enum: ['pending', 'completed', 'cancelled'], 
            default: 'pending'}},
        {
            timestamps: true
        }
    );

const OrdersModel = mongoose.model("Order", OrdersSchema);

export default OrdersModel;