import categorySchema from '../models/category.model.js';
import slugify from 'slugify';
import router from '../routers/category.router.js';

export const categoryCreateController = async (req, res) => {
  const { name, slug, parentId } = req.body;

  try {
    if (!name.trim()) {
      return res.status(400).json({
        message: 'Name is required',
      });
    }
    const objCategory = new categorySchema({
      name: name,
      slug: slugify(name),
    });
    if (parentId) objCategory.parentId = parentId;
    await objCategory.save();
    res.status(201).json({
      success: true,
      message: 'created category success',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const categoryGetController = async (req, res) => {
  try {
    const categories = await categorySchema.find();
    // const categoryList = createCategories(categories);
    res.status(200).json({
      success: true,
      message: 'Get list category success',
      categoryList: categories,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

// function createCategories(categories, parentId = null) {
//   let category;
//   const categoryList = [];
//   if (parentId == null) {
//     category = categories.filter(item => item.parentId == undefined);
//   } else {
//     category = categories.filter(item => item.parentId == parentId);
//   }

//   for (let cate of category) {
//     categoryList.push({
//       id: cate._id,
//       name: cate.name,
//       slug: cate.slug,
//       value: cate.value,
//       children: createCategories(categories, cate._id),
//     });
//   }
//   return categoryList;
// }

export const categoryUpdateController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name.trim()) {
      return res.status(400).json({
        message: 'Name is required',
      });
    }
    const newObjCategory = {
      name: name,
      slug: slugify(name),
    };
    const category = await categorySchema.findOneAndUpdate(
      { _id: id },
      newObjCategory,
      { new: true }
    );
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'not found category',
      });
    }
    res.status(201).json({
      success: true,
      message: 'update category success',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const categoryDeleteController = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categorySchema.findOneAndDelete({ _id: id });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Not found category',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Delete category success',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
