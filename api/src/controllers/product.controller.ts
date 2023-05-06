import { RequestHandler } from "express";
import { prisma } from "../database";

export const getAllProducts: RequestHandler = async (_req, res) => {
    const products = await prisma.product.findMany()

    return res.send({
        message: 'GET Products successful',
        data: products
    })
}

export const isProductIDValid = (id?: string) => /^[1-9]\d*$/.test(id ?? '')

export const getSingleProduct: RequestHandler = async (req, res) => {
    const id = req.params['id']

    if (!isProductIDValid(id)) {
        return res.status(422).send({
            error: 'Product ID must be a non-zero whole number'
        })
    }

    const product = await prisma.product.findFirst({
        where: { id: { equals: parseInt(req.params['id'] as string) } }
    })

    return res.send({
        message: `GET Product ${req.params['id']} successful`,
        data: product
    })
}