const {Router} = require ('express')
// const CartManager = require('../cartsManager')
// const ProductManager = require('../productsManager')
const cartManager = require('../dao/mongo/cart.mongo')
const productManager = require('../dao/mongo/product.mongo')

const router = Router();

// ------------>>>>>> POST <<<<<<------------
router.post('/', async (req, res) => {
  try {
      let result = await cartManager.addCart()
      if (!result || result.status === 'error') {
          return res.status(404).send({status: 'error', error: result})
      }
      res.status(200).send({status: 'success', payload: result})
  } catch (error) {
      res.status(500).send({status: 'ERROR', error: 'Ha ocurrido un error al crear el carrito'})
      return error
  }
})

router.post('/:cid/product/:pid', async (req, res) => {
  try {
      const { cid, pid } = req.params;
      const cart = await cartManager.getCartById(cid)
      if (!cart || cart.status === 'error') {
          return res.status(404).send({status: 'error', error: `No existe el carrito id ${cid}`});
      }
      const product = await productManager.getProductById(pid)
      if (!product || product.status === 'error') {
          return res.status(404).send({status: 'error', error: `No existe el producto id ${pid}`});
      }
      result = await cartManager.addProduct(cid, pid)
      res.status(200).send({status: 'success', payload: result})
  } catch (error) {
      res.status(500).send({status: 'ERROR', error: 'Ha ocurrido un error al crear el carrito'})
      return error
  }
});

// ------------>>>>>> GET <<<<<<------------
router.get('/:cid', async (req, res) => {
  try {
      const {cid} = req.params;
      let cart = await cartManager.getCartById(cid)
      if (!cart || cart.status === 'error') {
          return res.status(404).send({status: 'error', error: `No existe el carrito id ${cid}`})
      }
      return res.status(200).send({status: 'success', payload: cart})
  } catch (error) {
      res.status(500).send({status: 'ERROR', error: 'Ha ocurrido un error al obtener el carrito'})
      return error
  }
})

module.exports = router