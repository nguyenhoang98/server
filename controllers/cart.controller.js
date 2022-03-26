import cartSchema from '../models/cart.model.js';
import productSchema from '../models/product.model.js';
import userSchema from '../models/auth.model.js';

export const getCart = async (req, res) => {
  try {
    const carts = await cartSchema.find({ user: req.user._id });
    res.status(200).json({
      success: true,
      message: 'get cart success',
      carts,
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const addCart = async (req, res) => {
  const { id, category, color, size, quantity, price } = req.body;
  try {
    const productAddToCart = await productSchema.findOne({ _id: id });
    if (!productAddToCart) {
      return res.status(404).json({
        success: false,
        message: 'product not found',
      });
    }
    const user = await userSchema.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({
        success: 'user not found',
      });
    }

    const cartOfUser = await cartSchema.findOne({ user: req.user._id });
    if (!cartOfUser) {
      const newObjCart = new cartSchema({
        user: req.user._id,
        cartItems: [
          {
            productId: id,
            category: category,
            productSrc: productAddToCart.productAvatar[0],
            description: productAddToCart.description,
            title: productAddToCart.title,
            discount: productAddToCart.discount,
            color: color,
            size: size,
            quantity: quantity,
            price: price,
            afterPrice: productAddToCart.discount
              ? price - (price * productAddToCart.discount) / 100
              : price,
          },
        ],
      });
      await newObjCart.save();
      return res.status(201).json({
        success: true,
        message: 'add to cart success',
      });
    }

    if (cartOfUser) {
      // xét productId ;
      const checkProduct = cartOfUser.cartItems.find(
        item =>
          item.productId.toString() === id &&
          item.color === color &&
          item.size === size
      );
      if (!checkProduct) {
        await cartSchema.findOneAndUpdate(
          { user: req.user._id },
          {
            $push: {
              cartItems: {
                productId: id,
                category: category,
                productSrc: productAddToCart.productAvatar[0],
                description: productAddToCart.description,
                title: productAddToCart.title,
                discount: productAddToCart.discount,
                color,
                size,
                quantity,
                price,
                afterPrice: productAddToCart.discount
                  ? price - (price * productAddToCart.discount) / 100
                  : price,
              },
            },
          },
          { new: true }
        );
        return res.status(201).json({
          success: true,
          message: 'Add to cart success',
        });
      } else {
        await cartSchema.findOneAndUpdate(
          {
            user: req.user._id,
            'cartItems.productId': id,
            'cartItems.color': color,
            'cartItems.size': size,
          },
          {
            $set: {
              'cartItems.$.productId': id,
              'cartItems.$.category': category,
              'cartItems.$.productSrc': productAddToCart.productAvatar[0],
              'cartItems.$.description': productAddToCart.description,
              'cartItems.$.title': productAddToCart.title,
              'cartItems.$.discount': productAddToCart.discount,
              'cartItems.$.color': color,
              'cartItems.$.size': size,
              'cartItems.$.quantity': quantity + checkProduct.quantity,
              'cartItems.$.price': price,
              'cartItems.$.afterPrice': productAddToCart.discount
                ? price - (price * productAddToCart.discount) / 100
                : price,
            },
          },
          { new: true }
        );
        return res.status(201).json({
          success: true,
          message: 'add to cart success',
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error ${error.message}`,
    });
  }
};

export const deleteCart = async (req, res) => {
  const { id } = req.params;
  const { size, color } = req.body;
  const userId = req.user._id;
  try {
    const user = await userSchema.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'user not found',
      });
    }

    await cartSchema.findOneAndUpdate(
      {
        user: userId,
        'cartItems.productId': id,
        'cartItems.color': color,
        'cartItems.size': size,
      },
      {
        $pull: {
          cartItems: {
            productId: id,
            color: color,
            size: size,
          },
        },
      }
    );
    return res.status(200).json({
      success: true,
      message: 'Delete cartItem  success',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
