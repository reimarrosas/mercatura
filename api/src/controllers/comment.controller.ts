import { RequestHandler } from "express";
import { prisma } from "../database";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { narrowCommentSchema } from "../utils/narrowing";

export const createComment: RequestHandler = async (req, res) => {
    if (!narrowCommentSchema(req.body)) {
        return res.status(422).send({
            error: 'Body should contain: content|string, product_id|number'
        })
    }

    const userId = req.session.user!.id

    const { content, productId } = req.body

    let data
    try {
        data = await prisma.comment.create({
            data: {
                content,
                user_id: userId,
                product_id: productId
            }
        })
    } catch (err: any) {
        if (err instanceof PrismaClientKnownRequestError) {
            return res.status(403).send({
                error: 'Cannot comment on non-existent product'
            })
        }
    }
    return res.status(201).send({
        message: 'Comment creation successful',
        data
    })
}