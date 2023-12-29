# Shopify App

## Overview
This is a simple Node.js application for interacting with the Shopify GraphQL Admin API. It includes endpoints to fetch and add products to a Shopify store.

## Installation
1. Clone the repository: `git clone https://github.com/hjasaiwal114/shoap2.git`
2. Install dependencies: `npm install`
3. Create a `.env` file and add your Shopify store URL and access token:

```dotenv
SHOPIFY_STORE_URL=your-shopify-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=your-access-token

# Shopify Store API

This application provides a simple API for interacting with a Shopify store. Follow the instructions below to get started.

## Usage

1. Start the application:

   ```bash
   node app.js

## Examples

GET/getProducts
`curl http://localhost:3000/getProducts`

POST/addProduct

`curl -X POST -H "Content-Type: application/json" -d '{"title": "New Product", "price": "19.99"}' http://localhost:3000/addProduct
`

# shoap2
