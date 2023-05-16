const {cartModel} = require('./models/carts.model')

class CartManagerMongo {
    getCarts = async () => {
        try {
            return await cartModel.find()
        } catch (error) {
            return {status: 'error', error: error}
        }
    }

    getCartById = async (cid) => {
        try {
            return await cartModel.findOne({_id: cid})
        } catch (error) {
            return {status: 'error', error: error}
        }
    }

    addCart = async () => {
        try {
            return await cartModel.create({})
        } catch (error) {
            return {status: 'error', error: error}
        }
    }

    addProduct = async (cid, pid) => {
        try {
            const cart = await cartModel.findOne({_id: cid})
            const products = cart.product.find((producto) => producto.idProduct === pid)
            if (!products) {
                return await cartModel.updateOne({_id: cid}, {$push: {product: {idProduct: pid, quantity: 1}}})
            } else {
                return await cartModel.updateOne({_id: cid, "product.idProduct": pid }, {$inc: {"product.$.quantity": 1}})
            }
        } catch (error) {
            return {status: 'error', error: error}
        }
    }
}

module.exports = new CartManagerMongo();