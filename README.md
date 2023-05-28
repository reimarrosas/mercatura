# Mercatura

An ECommerce app where the owner can handle their online store and where customers can look and purchase different products.

## Installation

_To be created_

## Tech Stack

### Frontend

1. VueJS - Frontend Framework
2. Vue-Rotuer - Client-side Routing
3. Pinia - State management
4. Tailwindcss - CSS Framework
5. Vitest - Frontend Unit Testing
6. Playwright - End-to-end Testing

### Backend

1. NodeJS - Backend Runtime
2. Express - Backend Framework
3. Nodemailer - Mailing service
4. Prisma - ORM
5. PostgreSQL - Database
6. Redis - Session store
7. Supertest - Backend Integration Testing Helper
8. Jest - Backend Unit/Integration Testing

### General

1. Typescript - Language
2. Docker/Docker Compose - Containerization for testing

## Specification

### Authentication

1. As a customer, I should be able to login to access my account.
2. As a customer, I should be able to signup to create an account.
3. As a customer, I should be able to verify my account during creation

### Admin

1. As an admin, I should be able to login to access my ECommerce dashboard

### Products

1. As a customer, I should be able to view all products
2. As a customer, I should be able to search for products that match my criteria
3. As a customer, I should be able to view a single product
4. As an admin, I should be able to create new products using the dashboard
5. As an admin, I should be able to update products using the dashboard
6. As an admin, I should be able to delete products using the dashboard

### Categories

1. As a customer, I should be able to view products related to a category
2. As an admin, I should be able to create new categories using the dashboard
3. As an admin, I should be able to assign categories to new and existing products
4. As an admin, I should be able to retract categories from existing products

### Comment

1. As a customer, I should be able to view comments on products
2. As a customer, I should be able to comment my views on individual products
3. As an admin, I should be able to view comments on products
4. As an admin, I should be able to reply to comment on products

### Ratings

1. As a customer, I should be able to see how the product is rated from 1 to 5
2. As an admin, I should be able to see how the product is rated from 1 to 5

### Purchase

1. As a customer, I should be able to checkout my cart when I finish shopping

### Invoice

1. As a customer, I should be able to see the invoice of the purchase
2. As an admin, I should be able to see the invoice of a customer's purchase
