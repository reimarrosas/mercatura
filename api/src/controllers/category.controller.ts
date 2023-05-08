import { RequestHandler } from "express";
import { prisma } from "../database";
import { isIDValid } from "../utils/isIDValid";

export const getAllCategories: RequestHandler = async (_req, res) => {
    const categories = await prisma.category.findMany()

    return res.send({
        message: 'GET Categories successful',
        data: categories
    })
}

export const getSingleCategory: RequestHandler = async (req, res) => {
    const id = req.params['id']

    if (!isIDValid(id)) {
        return res.status(422).send({
            error: 'Category ID must be a non-zero whole number'
        })
    }

    const product = await prisma.category.findFirst({
        where: { id: { equals: parseInt(id) } }
    })

    return res.send({
        message: `GET Product ${product?.id} successful`,
        data: product
    })
}