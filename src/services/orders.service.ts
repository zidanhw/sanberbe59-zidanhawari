import { IUserToken } from "../utils/jwt";
import OrdersModel, {Order} from "../models/orders.model";
import ProductsModel from "../models/products.model";


export const create = async (payload: Order, user: IUserToken): Promise<Order> => {
    for (const item of payload.orderItems) {
      const product = await ProductsModel.findById(item.productId);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }
      if (product.qty < item.qty) {
        throw new Error(`Insufficient quantity for product: ${product.name}`);
      }
      product.qty -= item.qty;
      await product.save();
    }
    const OrderWithCreator = {
      ...payload,
      createdBy: user.id  // Menambahkan createdBy field ke payload
    };
    const result = await OrdersModel.create(OrderWithCreator);
    return result
  }

export const findAll = async (
  user: IUserToken,
  query: any = {},
  limit: number = 10,
  page: number = 1
): Promise<{ orders: Order[]; total: number; page: number; totalPages: number }> => {
  const finalQuery = { ...query, createdBy: user.id };

  const total = await OrdersModel.countDocuments(finalQuery);
  const totalPages = Math.ceil(total / limit);

  const orders = await OrdersModel.find(finalQuery)
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 })
    .populate("createdBy");

  return {
    orders,
    total,
    page,
    totalPages
  };
};