import { RequestHandler } from "express";
import argon2 from 'argon2'

import { narrowLoginCredentials, narrowSignupCredentials } from "../utils/narrowing";
import { prisma } from "../database";

// Returns true if email has '@' symbol and '.' symbol in the default places
export const isValidEmail = (str: string) => /.+@.+/.test(str)

// Returns true if password has at least 1 lowercase, 1 uppercase, 1 number, and 8 characters long
export const isValidPassword = (str: string) => /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(str)

// Returns true of the requestBody conforms to the SignupCredentials schema and has valid email, password, and confirmPassword
export const signup: RequestHandler = async (req, res) => {
    if (!narrowSignupCredentials(req.body)) {
        return res.status(422).send({
            error: 'Body should contain: name|string, email|string, password|string, confirmPassword|string'
        })
    } else if (!isValidEmail(req.body.email)) {
        return res.status(422).send({
            error: 'Invalid email'
        })
    } else if (!isValidPassword(req.body.password)) {
        return res.status(422).send({
            error: 'Invalid password'
        })
    } else if (req.body.password !== req.body.confirmPassword) {
        return res.status(422).send({
            error: 'Password does not match'
        })
    }

    const user = await prisma.user.findFirst({
        where: { email: req.body.email }
    })

    if (user) {
        return res.status(403).send({
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
            error: 'Something broke'
        })
    }

    return res.status(201).send({
        message: 'User signup successful',
    })
}

export const login: RequestHandler = async (req, res) => {
    if (!narrowLoginCredentials(req.body)) {
        return res.status(422).send({
            error: 'Body should contain: email|string, password|string'
        })
    } else if (!isValidEmail(req.body.email)) {
        return res.status(422).send({
            error: 'Invalid email'
        })
    } else if (!isValidPassword(req.body.password)) {
        return res.status(422).send({
            error: 'Invalid password'
        })
    }

    const user = await prisma.user.findFirst({
        where: { email: req.body.email }
    })

    if (!user) {
        return res.status(403).send({
            error: 'User does not exist'
        })
    }

    const isPasswordMatching = await argon2.verify(user.password, req.body.password)

    if (!isPasswordMatching) {
        return res.status(401).send({
            error: 'Invalid password'
        })
    }

    req.session.user = {
        id: user.id,
        email: user.email,
        name: user.name
    }

    return res.send({
        message: 'User login successful',
    })
}

export const authGuard: RequestHandler = async (req, res, next) => {
    if (req.session.user) {
        return next()
    }

    return res.status(401).send({
        error: 'User not authenticated'
    })
}