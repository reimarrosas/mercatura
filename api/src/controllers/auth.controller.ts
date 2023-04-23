import { RequestHandler } from "express";
import argon2 from 'argon2'

import { narrowSignupCredentials } from "../utils/narrowing";
import { prisma } from "../database";

// Returns true if email has '@' symbol and '.' symbol in the default places
export const isValidEmail = (str: string) => /.+@.+/.test(str)

// Returns true if password has at least 1 lowercase, 1 uppercase, 1 number, and 8 characters long
export const isValidPassword = (str: string) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(str)

// Returns true of the requestBody conforms to the SignupCredentials schema and has valid email, password, and confirmPassword
export const signup: RequestHandler = async (req, res) => {
    if (!narrowSignupCredentials(req.body)) {
        return res.status(422).send({
            message: null,
            error: 'Body should contain: name|string, email|string, password|string, confirmPassword|string'
        })
    } else if (!isValidEmail(req.body.email)) {
        return res.status(422).send({
            message: null,
            error: 'Invalid email'
        })
    } else if (!isValidPassword(req.body.password)) {
        return res.status(422).send({
            message: null,
            error: 'Invalid password'
        })
    } else if (req.body.password !== req.body.confirmPassword) {
        return res.status(422).send({
            message: null,
            error: 'Password does not match'
        })
    }

    const user = await prisma.user.findFirst({
        where: { email: req.body.email }
    })

    if (user) {
        return res.status(403).send({
            message: null,
            error: 'User already exists'
        })
    }

    const data = {
        name: req.body.name,
        email: req.body.email,
        password: await argon2.hash(req.body.password)
    }

    const insertedUser = await prisma.user.create({ data })

    if (!insertedUser) {
        res.status(500).send({
            message: null,
            error: 'Something broke'
        })
    }

    return res.status(201).send({
        message: 'User signup successful',
        error: null
    })
}