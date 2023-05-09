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

    const category = await prisma.category.findFirst({
        where: { id: { equals: parseInt(id) } }
    })

    if (!category) {
        return res.status(404).send({
            error: `Category ${id} not found`
        })
    }

    return res.send({
        message: `GET Product ${category.id} successful`,
        data: category
    })
}

export const getCategoryProducts: RequestHandler = async (req, res) => {
    const id = req.params['id']

    if (!isIDValid(id)) {
        return res.status(422).send({
            error: 'Category ID must be a non-zero whole number'
        })
    }

    const category = await prisma.category.findFirst({
        where: {
            id: { equals: parseInt(id) }
        },
        include: { products: true }
    })

    if (!category) {
        return res.status(404).send({
            error: `Category ${id} not found`
        })
    }

    return res.send({
        message: `GET Products with Category ${id} successful`,
        data: category.products
    })
}