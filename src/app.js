const express = require('express')
const cookieParser = require('cookie-parser')
const objectConfig = require('./config/objectConfig')
const productRouter = require('./routers/products.router')
const cartRouter = require('./routers/cart.router')
const viewsRouter = require('./routers/views.router')
const ProductManager = require('./dao/fileSystem/productsManager')
const { Server } = require('socket.io')
const handlebars = require('express-handlebars')

const productsList = new ProductManager('./src/archivosdb/productos.json')
const app = express()
const PORT = 8080
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`)
});
const socketServer = new Server(httpServer)

objectConfig.connectDB()

socketServer.on("connection", (socket) => {
    console.log("Nuevo Cliente Conectado.");
    socket.on("productDelete", async (pid) => {
        const id = await productsList.getProductById(parseInt(pid.id));
        console.log(id);
        if (id) {
            await productsList.deleteById(parseInt(pid.id));
            const data = await productsList.getProducts();
            return socketServer.emit("newList", data);
        }
        if (!id) {
            socketServer.emit("newList", { status: "error", message: `No se encontro el producto con id ${pid.id}` });
        }
    });

    socket.on("newProduct", async (data) => {
        let datas = await productsList.addProduct(data);
        if (datas.status === "error") {
            let error = datas.message;
            return socketServer.emit("productAdd", { status: "error", message: error });
        }
        const newData = await productsList.getProducts();
        return socketServer.emit("productAdd", newData);
    });
});

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname+'/views')
app.set('view engine', 'handlebars')
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/static', express.static(__dirname + '/public'))
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/', viewsRouter)