import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './routers/user.router.js';
import productRouter from './routers/product.router.js';
import cartRouter from './routers/cart.router.js';
import categoryRouter from './routers/category.router.js';
import commentRouter from './routers/comment.router.js';
import optionRouter from './routers/option.router.js';
import orderRouter from './routers/order.router.js';
import orderHistory from './routers/orderHistory.router.js';

import http from 'http';
import { Server } from 'socket.io';

dotenv.config();
const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@server-shop.bm6gr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log('connect successfully');
  } catch (error) {
    console.log(error.message);
  }
};
connectDB();
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.use('/api/auth', userRouter);
app.use('/api/category', categoryRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/comment', commentRouter);
app.use('/api/order', orderRouter);
app.use('/api/orderHistory', orderHistory);

app.use('/api/option', optionRouter);

const server = http.createServer(app);
export const io = new Server(server, {
  transports: ['polling'],
  cors: {
    origin: '*',
  },
});
io.on('connection', socket => {
  console.log('connect');
  socket.on('disconnect', () => {
    console.log('off');
  });
});

server.listen(port, () => {
  console.log(`app listen at port ${port}`);
});
