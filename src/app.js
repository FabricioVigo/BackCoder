import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import path from "path";

import productsFSRouter from "./routes/product.js";
import cartsFSRouter from "./routes/cart.js";
import cartsDBRouter from "./routes/cartsDB.router.js";
import productsDBRouter from "./routes/productsDB.router.js";
import viewsRouter from "./routes/viewsRouter.js";
import ProductManagerFS from "./dao/productManager.js";
import { __dirname } from "./utils/utils.js";
import { messagesModel } from "./dao/models/messages.model.js";

const app = express();
const port = 8080;
const pm = new ProductManagerFS(path.join(__dirname, "../files/products.json"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname,"../views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../public")));
app.use("/", viewsRouter);
app.use("/api/productsFS", productsFSRouter);
app.use("/api/cartsFS", cartsFSRouter);
app.use("/api/cartsDB", cartsDBRouter);
app.use("/api/productsDB", productsDBRouter);

const httpServer = app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});


const io = new Server(httpServer);

io.on("connection", async (socket) => {
  console.log("New client connected");

  socket.on("deleteProduct", async (id) => {
    let response = await pm.deleteProductSocket(id);
    socket.emit("deleteProductRes", response);
    if (response.success) {
      socket.broadcast.emit("productListUpdated");
    }
  });
  
  socket.on("addProduct", async (product) => {
    let response = await pm.addProductSocket(product);
    socket.emit("addProductRes", response);
    if (response.success) {
      socket.broadcast.emit("productListUpdated");
    }
  });

  socket.on("newMessage", async ({ user, message }) => {
    await messagesModel.create({ user: user, message: message });
    io.emit("messagesListUpdated");
  })
});

const connect = async () => {
  try {
    await mongoose.connect('mongodb+srv://coderhouse:coderhouse@cluster0.cz0fbqs.mongodb.net/?retryWrites=true&w=majority');
    console.log("DB connection success");
  } catch (error) {
    console.log(`DB connection fail. Error: ${error}`);
  }
}

connect();

io.on("error", (error) => console.error(error));