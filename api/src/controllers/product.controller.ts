import { RequestHandler } from "express";
import { prisma } from "../database";

export const getAllProducts: RequestHandler = async (_req, res) => {
    const products = await prisma.product.findMany()

    return res.send({
        message: 'GET Products successful',
        data: products
    })
}