import {Request, Response} from "express";
import {
    create,
    findAll,
    findOne,
    update,
    remove
} from "../services/products.service";

import * as Yup from "yup";
import {IPaginationQuery} from '../utils/interfaces';
import { IRequestWithUser } from "../middleware/auth.middleware";

const createValidationSchema = Yup.object().shape({
    name: Yup.string().required(),
    description: Yup.string().required(),
    images: Yup.array().of(Yup.string()).required().min(1),
    price: Yup.number().required(),
    qty: Yup.number().required(),
    categoryId: Yup.string().required(),
});


export default {
    
    async create(req: IRequestWithUser, res: Response) {
        /**
        #swagger.tags = ['Products']
        #swagger.summary = 'Create a new product'
        #swagger.security = [{
        "bearerAuth": []
        }]
        #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/ProductCreateRequest"
        }
        }
        */
        try {
            if (!req.user) {
                return res.status(403).json({
                  message: "unauthorized",
                  data: null,
                });
            }
            await createValidationSchema.validate(req.body);
            const result = await create(req.body, req.user);
            res.status(201).json({
                data: result,
                message: "Success create product."
            });
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                res.status(400).json({       
                  data: error.errors,        
                  message: "Failed create product",       
                });        
                return;        
              };
            
            const err = error as Error;
            res.status(500).json({
                data: err.message,
                message: "Failed create product."
            });
        }
    },
    async findAll(req: Request, res: Response) {
        /**
         #swagger.tags = ['Products']
         #swagger.summary = 'Get all products'
        */
        try {
            const {
                limit = 10,
                page = 1,
                search = "",
            } = req.query as unknown as IPaginationQuery;
            const query = {};
    
            if (search) {
                Object.assign(query, {
                name: { $regex: search, $options: "i" },
                }); 
            }

            const result = await findAll(query, limit, page)       
        
            res.status(200).json({  
                data: result,
                message: "Success get all products",
            });
        } catch (error) {   
            const err = error as Error;
            res.status(500).json({
                data: err.message,
                message: "Failed get all products",
            });
        }
    },
    async findOne(req:Request, res: Response) {
        /**
         #swagger.tags = ['Products']
         #swagger.summary = 'Get a product'
        */
        try {
            const result = await findOne(req.params?.id);

            res.status(200).json({
                data: result,
                message: "Success find product."
            })
        } catch(error) {
            const err = error as Error;
            res.status(500).json({
                data: err.message,
                message: "Failed find product."
            });
        }
    },
    async update (req: Request, res: Response) {
        /**
         #swagger.tags = ['Products']
         #swagger.summary = 'Update a product'
        #swagger.security = [{
        "bearerAuth": []
        }]
        #swagger.requestBody = {
        required: true,
        schema: {
            $ref: "#/components/schemas/ProductCreateRequest"
        }
        }
        */
        try {
            const result = await update(req.params?.id, req.body);

            res.status(200).json({
                data: result,
                message: "Success update product."
            });
        } catch (error) {
            const err = error as Error;

            res.status(500).json({
                data: err.message,
                message: "Failed update product."
            })
        }
    },
    async delete (req: Request, res: Response) {
        /**
        #swagger.tags = ['Products']
        #swagger.summary = 'Delete a product'
        #swagger.security = [{
        "bearerAuth": []
        }]
        */
        try {
            const result = await remove(req.params?.id);

            res.status(200).json({
                data: result,
                message: "Success delete product."
            });
        } catch (error) {
            const err = error as Error;

            res.status(500).json({
                data: err.message,
                message: "Failed delete product."
            })
        }
    }
}