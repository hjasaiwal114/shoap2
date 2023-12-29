// Importing necessary packages
require('dotenv').config();  // Load environment variables from .env file
const express = require('express');

const port = 3000;

// Use dynamic import to resolve the ESM issue
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Extract Shopify store URL and access token from environment variables
const { SHOPIFY_STORE_URL, SHOPIFY_ACCESS_TOKEN } = process.env;
const app = express();  // Create an Express application

// Enable JSON parsing middleware for handling JSON requests
app.use(express.json());

// Existing route to get products from the Shopify store
app.get('/getProducts', async (req, res) => {
    try {
        const graphqlEndpoint = `https://${SHOPIFY_STORE_URL}/admin/api/2023-10/graphql.json`;
        
        // GraphQL query to retrieve product information
        const query = `
        {
            products(first: 5) {
                edges {git 
                    node {
                        id
                        title
                        handle
                        description
                        variants(first: 1) {
                            edges {
                                node {
                                    id
                                    title
                                }
                            }
                        }
                    }
                }
            }
        }
        `;

        // Fetch data from Shopify GraphQL endpoint
        const response = await fetch(graphqlEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
            },
            body: JSON.stringify({ query }),
        });

        const data = await response.json();
        const simplifiedResponse = transformResponse(data);

        res.json(simplifiedResponse);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// New route to create a product in the Shopify store
app.post('/addProduct', async (req, res) => {
    try {
        const graphqlEndpoint = `https://${SHOPIFY_STORE_URL}/admin/api/2023-10/graphql.json`;
        const { title, price } = req.body;

        // GraphQL mutation to create a new product
        const mutation = `
        mutation {
            productCreate(input: {
                title: "${title}"
                variants: {
                    price: "${price}"
                }
            }) {
                product {
                    id
                    title
                }
            }
        }
        `;

        // Fetch data from Shopify GraphQL endpoint
        const response = await fetch(graphqlEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
            },
            body: JSON.stringify({ query: mutation }),
        });

        const data = await response.json();
        const createdProduct = data.data.productCreate.product;

        // Update the response with the created product
        res.json({ message: 'Product created successfully', product: createdProduct });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Existing transformResponse function to simplify the GraphQL response
function transformResponse(data) {
    return {
        products: data.data.products.edges.map(productEdge => {
            const productNode = productEdge.node;
            return {
                id: productNode.id.replace('gid://shopify/Product/', ''),
                title: productNode.title,
                handle: productNode.handle,
                description: productNode.description,
                variants: productNode.variants.edges.map(variantEdge => {
                    const variantNode = variantEdge.node;
                    return {
                        id: variantNode.id.replace('gid://shopify/ProductVariant/', ''),
                        title: variantNode.title,
                    };
                }),
            };
        }),
    };
}

// Start the Express server
app.listen(port, () => {
    console.log(`Server is listening at ${port}`);
});
