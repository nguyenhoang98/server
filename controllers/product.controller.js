import productSchema from '../models/product.model.js';
import slugify from 'slugify';

export const createProductController = async (req, res) => {
  const {
    title,
    price,
    description,
    discount,
    productAvatar,
    category,
    flashSale,
    info,
  } = req.body;
  if (!title || !description || !price || !productAvatar || !category) {
    return res.status(400).json({
      success: false,
      message:
        'title/description/price/productAvatar/category/status/statusText is required',
    });
  }
  try {
    const quantity = info.length
      ? info.reduce((total, value) => {
          return total + value.quantity;
        }, 0)
      : 0;
    const productObj = new productSchema({
      title,
      slug: slugify(title),
      description,
      price,
      quantity: quantity || 0,
      productAvatar,
      category,
      status: quantity > 0 ? 'stock' : 'outStock',
      statusText: quantity > 0 ? 'Còn hàng' : 'Hết hàng',
      flashSale,
      discount,
      createdBy: req.user._id,
      info,
    });
    await productObj.save();
    res.status(200).json({
      success: true,
      message: 'create product successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error ${error.message}`,
    });
  }
};

export const getProductController = async (req, res) => {
  try {
    const query = req.query;
    let page = Number(query.page) || 1;
    let begin = (page - 1) * Number(query.limit);
    let end = Number(query.limit) * Number(page);
    let condition = {};
    let conditionSort = {
      price: query.sortPrice ? Number(query.sortPrice) : null,
      title: query.sortName ? query.sortName : null,
    };
    if (query.keyword) {
      var search = query.keyword;
      condition = { title: { $regex: new RegExp(search), $options: 'si' } };
    } else {
      for (let i in query) {
        if (query[i]) {
          condition[i] = query[i];
        }
      }
    }
    const totalFilter = await productSchema.find(condition);
    // console.log('condition', condition);
    // console.log('conditionSort', conditionSort);
    const product = await productSchema
      .find(condition)
      .skip(begin)
      .limit(end)
      .sort(conditionSort);
    const totalElement = await productSchema.find();
    res.status(200).json({
      success: true,
      message: 'get product success',
      product: product,
      totalElement: totalElement.reduce((total, value) => {
        return total + value.quantity;
      }, 0),
      totalFilter: totalFilter.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error ${error.message} `,
    });
  }
};

export const deleteProductController = async (req, res) => {
  const { id } = req.params;
  try {
    const productDelete = await productSchema.findOneAndDelete({ _id: id });
    if (!productDelete) {
      return res.status(400).json({
        success: false,
        message: 'Not found product',
      });
    }
    res.status(200).json({
      success: 200,
      message: 'delete product success',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const updateProductController = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    price,
    productAvatar,
    category,
    flashSale,
    discount,
    info,
  } = req.body;
  try {
    if (!title || !description || !price || !productAvatar || !category) {
      return res.status(400).json({
        success: false,
        message:
          'title/description/price/quantity/productAvatar/category/status/statusText is required',
      });
    }
    const condition = { _id: id };
    const quantity = info.length
      ? info.reduce((total, value) => {
          return total + value.quantity;
        }, 0)
      : 0;
    const newProduct = {
      title,
      description,
      price,
      quantity: quantity,
      productAvatar,
      category,
      status: quantity > 0 ? 'stock' : 'outStock',
      statusText: quantity > 0 ? 'Còn hàng' : 'Hết hàng',
      flashSale,
      discount,
      info,
    };
    const productUpdate = await productSchema.findOneAndUpdate(
      condition,
      newProduct,
      {
        new: true,
      }
    );
    if (!productUpdate) {
      return res.status(400).json({
        success: false,
        message: 'Not found product',
      });
    }
    res.status(200).json({
      success: true,
      message: 'update product success',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const ratingController = async (req, res) => {
  const userId = req.user._id;
  const { rating } = req.body;
  const { id } = req.params;
  try {
    const productRating = await productSchema.find({ _id: id });
    if (!productRating) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
    const checkRating = productRating[0]?.rating?.some(
      item => item.userId.toString() === userId
    );
    if (!checkRating) {
      await productSchema.findOneAndUpdate(
        { _id: id },
        {
          $push: {
            rating: {
              userId: userId,
              count: rating,
            },
          },
        }
      );
    } else {
      await productSchema.findOneAndUpdate(
        { _id: id, 'rating.userId': userId },
        {
          $set: {
            'rating.$.userId': userId,
            'rating.$.count': rating,
          },
        }
      );
    }
    res.status(200).json({
      success: true,
      message: 'Đã gửi đánh giá sản phẩm',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error ${error.message}`,
    });
  }
};
