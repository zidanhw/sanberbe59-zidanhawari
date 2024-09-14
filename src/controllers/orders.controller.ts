import {Request, Response} from "express";
import  {findAll, create}  from "../services/orders.service";
import { IRequestWithUser } from "../middleware/auth.middleware";
import { IPaginationQuery } from "../utils/interfaces";



export default {
    async create(req: IRequestWithUser, res: Response) {
      /**
         #swagger.tags = ['Orders']
         #swagger.summary = 'Create a new order'
         #swagger.security = [{
           "bearerAuth": []
         }]
         #swagger.requestBody = {
           required: true,
           schema: {
             $ref: "#/components/schemas/OrderCreateRequest"
           }
         }
         #swagger.responses[201] = {
           description: "Order created successfully",
           schema: { $ref: "#/components/schemas/OrderResponse" }
         }
         #swagger.responses[403] = {
           description: "Unauthorized",
           schema: { $ref: "#/components/schemas/ErrorResponse" }
         }
         #swagger.responses[500] = {
           description: "Server error",
           schema: { $ref: "#/components/schemas/ErrorResponse" }
         }
        */
        try {
            if (!req.user) {
                return res.status(403).json({
                  message: "unauthorized",
                  data: null,
                });
            }
            const result = await create(req.body, req.user);
            res.status(201).json({
                data: result,
                message: "Success create order."
            });
        } catch (error) {
            const err = error as Error;
            res.status(500).json({
                data: err.message,
                message: "Failed create order."
            });
        }
    },
    async findAll(req: IRequestWithUser, res: Response) {
         /**
         #swagger.tags = ['Orders']
         #swagger.summary = 'Get all orders for a user'
         #swagger.security = [{
           "bearerAuth": []
         }]
         #swagger.parameters['limit'] = {
           in: 'query',
           description: 'Number of items to return',
           type: 'integer',
           default: 10
         }
         #swagger.parameters['page'] = {
           in: 'query',
           description: 'Page number',
           type: 'integer',
           default: 1
         }
         #swagger.parameters['search'] = {
           in: 'query',
           description: 'Search term for order items or status',
           type: 'string'
         }
         #swagger.responses[200] = {
           description: "List of user's orders",
           schema: { $ref: "#/components/schemas/OrderListResponse" }
         }
         #swagger.responses[403] = {
           description: "Unauthorized",
           schema: { $ref: "#/components/schemas/ErrorResponse" }
         }
         #swagger.responses[500] = {
           description: "Server error",
           schema: { $ref: "#/components/schemas/ErrorResponse" }
         }
        */
        try {
          if (!req.user) {
            return res.status(403).json({
              message: "Unauthorized",
              data: null,
            });
          }
    
          const {
            limit = 10,
            page = 1,
            search = "",
          } = req.query as unknown as IPaginationQuery;
    
          const query: any = {};
    
          if (search) {
            Object.assign(query, {
              $or: [
                { "orderItems.name": { $regex: search, $options: "i" } },
                { status: { $regex: search, $options: "i" } },
              ],
            });
          }
    
          const result = await findAll(
            req.user,
            query,
            Number(limit),
            Number(page)
          );
    
          res.status(200).json({
            data: result.orders,
            meta: {
              total: result.total,
              page: result.page,
              totalPages: result.totalPages,
            },
            message: "Success get user's order history.",
          });
        } catch (error) {
          const err = error as Error;
          res.status(500).json({
            data: null,
            message: "Failed to get order history",
            error: err.message,
          });
        }
      },
}