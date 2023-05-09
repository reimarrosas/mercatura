import { RequestHandler } from "express";
import { prisma } from "../database";
import { isIDValid } from "../utils/isIDValid";

export const getAllProducts: RequestHandler = async (_req, res) => {
    const products = await prisma.product.findMany()

    return res.send({
        message: 'GET Products successful',
        data: products
    })
}

export const getSingleProduct: RequestHandler = async (req, res) => {
    const id = req.params['id']

    if (!isIDValid(id)) {
        return res.status(422).send({
            error: 'Product ID must be a non-zero whole number'
        })
    }

    const product = await prisma.product.findFirst({
        where: { id: { equals: parseInt(id) } }
    })

    if (!product) {
        return res.status(404).send({
            error: `Product ${id} not found`
        })
    }

    return res.send({
        message: `GET Product ${req.params['id']} successful`,
        data: product
    })
}