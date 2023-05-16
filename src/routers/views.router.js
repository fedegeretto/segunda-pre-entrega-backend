const { Router } = require('express')
const router = Router()
const productManager = require('../dao/mongo/product.mongo')
// const ProductManager = require('../dao/fileSystem/productsManager')
// const productsList = new ProductManager('./src/archivosdb/productos.json')

router.get("/", async (req, res) => {
    try {
        const { payload } = await productManager.getProducts()
        const object = {
            title: 'Productos',
            products: payload,
        }
        res.render('index', object)
    } catch (error) {}
});

// Con páginas
router.get('/products', async (req, res) => {
    try {
        const { page } = req.query;
        const { payload, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages } = await productManager.getProducts(undefined, page);
        if (page && (page > totalPages || page <= 0 || !parseInt(page))) {
            return res.status(400).send({ status: 'error', error: 'No existe la página' });
        }
        const object = {
            title: 'Productos',
            products: payload,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
        };
        res.render("products", object);
    } catch (error) {}
});

// router.get('/', async (req, res) => {
//     const limit = req.query.limit
//     const products = await productsList.getProducts(limit)
//     const objeto = {
//         title: "Lista de productos",
//         products
//     }
//     res.render('index', objeto)
//     console.log(products)
// })


// router.get("/realTimeProducts", async (req, res) => {
//     const products = await productsList.getProducts();
//     const object = {
//         title: "Productos en tiempo real",
//         products,
//     };
//     res.render("realTimeProducts", object);
// });

module.exports = router